<template>
  <div class="page">
    <div class="login-please warning" v-if="!user">
      <h1>Please log in or register to continue using CarSpace</h1>
    </div>
    <div class="intro" v-if="user">
      <h1><em>Begin building your own sweet ride</em></h1>
      <div class="car-selector">
        <h2>Pick a car to add parts to:</h2>
        <select v-model="selected_car">
          <option disabled value="">Select your car</option>
          <option v-for="car in cars" :key="car._id">{{car.name}}</option>
        </select>
      </div>
    </div>
    <div v-if="!current_car && user" class="warning">
      <h1>Select a car to begin adding parts</h1>
    </div>
    <div v-if="current_car && user" class="parts-list">
      <div class="part-item" :class="{ selected : current_car.engine == engine._id}" v-for="engine in engines" :key="engine._id" @click="editEngineOnCar(engine)">
        <h1>{{engine.name}}</h1>
        <img :src="getImgUrl(engine.photo)">
        <div class="specs">
          <div class="spec">
            <p>Part</p>
            <p>Engine</p>
          </div>
          <div class="spec">
            <p>Horsepower</p>
            <p>{{engine.hp}}</p>
          </div>
          <div class="spec">
            <p>Max Speed</p>
            <p>{{engine.maxSpeed}}</p>
          </div>
          <div class="spec">
            <p>Price</p>
            <p>${{engine.price}}</p>
          </div>
        </div>
      </div>
      <div class="part-item" :class="{ selected : current_car.transmission == transmission._id}" v-for="transmission in transmissions" :key="transmission._id" @click="editTransmissionOnCar(transmission)">
        <h1>{{transmission.name}}</h1>
        <img :src="getImgUrl(transmission.photo)">
        <div class="specs">
          <div class="spec">
            <p>Part</p>
            <p>Transmission</p>
          </div>
          <div class="spec">
            <p>Acceleration</p>
            <p>{{transmission.acceleration}}</p>
          </div>
          <div class="spec">
            <p>Price</p>
            <p>{{transmission.price}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {

  name: 'Parts',

  data() {
    return {
      cars: [],
      engines: [],
      transmissions: [],
      current_car: null,
      selected_car: this.selected_car
    }
  },

  created() {
    this.getCars();
    this.getEngines();
    this.getTransmissions();
  },

  computed: {
    user() {
      return this.$root.$data.user;
    }
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

    async editEngineOnCar(selected_engine) {
      if (selected_engine._id == this.current_car.engine){
        try {
          let deleteURL = "/api/cars/" + this.current_car._id + "/engine";
          await axios.delete(deleteURL);
          this.getCars();
          return true;
        } catch (error) {
          console.log(error);
        }
      }
      else {
        try {
          let postURL = "/api/cars/" + this.current_car._id + "/engine/" + selected_engine._id;
          await axios.put(postURL);
          this.getCars();
          return true;
        } catch (error) {
          console.log(error);
        }
      }
    },

    async editTransmissionOnCar(selected_transmission) {
      if (selected_transmission._id == this.current_car.transmission) {
        try {
          let deleteURL = "/api/cars/" + this.current_car._id + "/transmission";
          await axios.delete(deleteURL);
          this.getCars();
          return true;
        } catch (error) {
          console.log(error);
        }
      }
      try {
        let postURL = "/api/cars/" + this.current_car._id + "/transmission/" + selected_transmission._id;
        await axios.put(postURL);
        this.getCars();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    getImgUrl(photo) {
      return require('../assets/' + photo);
    },
  },

  watch: {
    selected_car: function (val) {
      for (var car of this.cars) {
        if (car.name == val) {
          this.current_car = car;
          break;
        }
      }
    },
    cars: function() {
      for (var car of this.cars) {
        if (car.name == this.selected_car) {
          this.current_car = car;
          break;
        }
      }
    }
  }
}
</script>

<style>
.page {
  width: 100%;
  margin-top: 10px;
}

.intro {
  background-color: #DBE8E1;
  padding: 20px;
  text-align: center;
}

.car-selector {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.car-selector select {
  margin-left: 20px;
  font-family: 'Varela Round', sans-serif;
  font-size: 20px;
}

.parts-list {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.part-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #DBE8E1;
  width: 280px;
  margin-top: 20px;
}

.part-item:hover {
  background-color: white;
  cursor: pointer;
}

.part-item h1 {
  padding: 5px;
}

.part-item img {
  width: 200px;
}

.specs {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  margin: 10px 0;
}

.spec {
  display: flex;
  width: 100%;
}

.spec p {
  width: 50%;
}

.selected {
  border: 5px solid #E10032;
}

.warning {
  padding: 20px;
  text-align: center;
  color: white;
}

@media only screen and (max-width: 650px) {

  .car-selector h2 {
    font-size: 20px;
  }

}
</style>