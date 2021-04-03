<template>
  <div class="page">
    <div class="intro">
      <h1>Create your custom car</h1>
      <div class="car-selector-2">
        <div class="select-car">
          <h2>Select a car:</h2>
          <select v-model="selected_car">
            <option disabled value="">Select a car</option>
            <option v-for="car in cars" :key="car._id">{{car.name}}</option>
          </select>
        </div>
        <div class="select-button">
          <button @click="makeNewCar()">Create a new car</button>
          <button @click="deleteCar()">Delete selected car</button>
        </div>
      </div>
    </div>
    <div class="warning" v-if="!current_car">
      <h1>No car selected</h1>
    </div>
    <div v-else class="page-body">
      <div class="page-column">
        <div class="car-info">
          <p>Name:</p>
          <input placeholder="Car Name" v-model="entered_name" @change="putCurrentCar()">
          <p>Color:</p>
          <select v-model="selected_color">
            <option disabled value="">Select a color</option>
            <option>Red</option>
            <option>Orange</option>
            <option>Yellow</option>
            <option>Blue</option>
            <option>Purple</option>
            <option>Black</option>
            <option>White</option>
          </select>
          <p>Price: ${{current_car.price}}</p>
        </div>
        <div v-if="current_engine" class="engine">
          <h3>Engine: {{current_engine.name}}</h3>
          <img :src="getImgUrl(current_engine.photo)">
        </div>
      </div>
      <div class="page-column">
        <div class="car-color">
          <img :src="getCarPicture()">
        </div>
        <div v-if="current_transmission" class="transmission">
          <h3>Transmission: {{current_transmission.name}}</h3>
          <img :src="getImgUrl(current_transmission.photo)">
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
export default {

  name: 'MyCars',

  data() {
    return {
      cars: [],
      engines: [],
      transmissions: [],
      current_car: null,
      current_engine: null,
      current_transmission: null,
      selected_car: this.selected_car,
      selected_color: this.selected_color,
      entered_name: this.entered_name
    }
  },

  created() {
    this.getCars();
    this.getEngines();
    this.getTransmissions();
  },

  methods: {

    async getCars() {
      try {
        let response = await axios.get("/api/cars");
        this.cars = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },

    async getEngines() {
      try {
        let response = await axios.get("/api/engines");
        this.engines = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },

    async getTransmissions() {
      try {
        let response = await axios.get("/api/transmissions");
        this.transmissions = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },

    async putCurrentCar() {
      var updatedCar;
      if (this.selected_color) {
        updatedCar = {
          name: this.entered_name,
          color: this.selected_color
        };
      }
      else {
        updatedCar = {
          name: this.entered_name,
          color: this.current_car.color
        };
      }
      try {
        await axios.put("/api/cars/" + this.current_car._id, updatedCar);
        await this.getCars();
        return true;
      } catch (error) {
        console.log(error);
      }
    },

    async makeNewCar() {
      try {
        let response = await axios.post("/api/cars/", {
          name: "New Car",
          color: "red"
        });
        await this.getCars();
        this.current_car = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },

    async deleteCar() {
      try {
        await axios.delete("/api/cars/" + this.current_car._id);
        await this.getCars();
        return true;
      } catch (error) {
        console.log(error);
      }
    },

    getImgUrl(photo) {
      if (!photo) {
        return require('../assets/logo.png');
      }
      return require('../assets/' + photo);
    },

    getTransmissionById(id) {
      for (var trans of this.transmissions) {
        if (trans._id == id) {
          return trans;
        }
      }
      return null;
    },

    getEngineById(id) {
      for (var eng of this.engines) {
        if (eng._id == id) {
          return eng;
        }
      }
      return null;
    },

    getCarPicture() {
      return require('../assets/' + this.current_car.color.toLowerCase() + '_car.jpg');
    }

  },

  watch: {
    selected_car: function (val) {
      for (var car of this.cars) {
        if (car.name == val) {
          this.current_car = car;
          this.current_engine = this.getEngineById(car.engine);
          this.current_transmission = this.getTransmissionById(car.transmission);
          this.entered_name = car.name;
          break;
        }
      }
    },
    selected_color: function () {
      this.putCurrentCar();
    },
    cars: function() {
      for (var car of this.cars) {
        if (car.name == this.selected_car) {
          this.current_car = car;
          this.current_engine = this.getEngineById(car.engine);
          this.current_transmission = this.getTransmissionById(car.transmission);
          this.entered_name = car.name;
          break;
        }
      }
    }
  }
}

</script>

<style>

.car-selector-2 {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.car-selector-2 .select-car {
  display: flex;
  justify-content: center;
}

.car-selector-2 .select-button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.car-selector-2 select {
  margin-left: 20px;
  font-family: 'Varela Round', sans-serif;
  font-size: 20px;
}

.car-selector-2 button {
  margin-left: 10px;
  font-family: 'Varela Round', sans-serif;
  padding: 4px;
  background-color: #E10032;
  color: white;
}

.page-body {
  display: flex;
  justify-content: space-evenly;
}

.page-column {
  display: flex;
  flex-direction: column;
}

.car-info {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
  font-size: 20px;
  background-color: #DBE8E1;
}

.car-info input, .car-info select{
  font-family: 'Varela Round', sans-serif;
  font-size: 20px;
}

.car-info p {
  margin-top: 20px;
}

.engine, .transmission {
  margin-top: 20px;
  background-color: #DBE8E1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.engine img, .transmission img{
  width: 250px;
  margin-top: 10px;
}

.car-color {
  display: flex;
  justify-content: center;
  background-color: #DBE8E1;
  padding: 20px;
  margin-top: 20px;
  height: 207px;
}

.car-color img {
  width: 250px;
  height: 100%;
}

@media only screen and (max-width: 650px) {
  .page-body {
    flex-direction: column;
  }

  .intro h1 {
    font-size: 25px;
  }

  .car-selector h2 {
    font-size: 20px;
  }
}

</style>