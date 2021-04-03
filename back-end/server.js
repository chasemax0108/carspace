const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false,
}));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/carspace', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const engineSchema = new mongoose.Schema({
    name: String,
    hp: String,
    maxSpeed: String,
    price: Number,
    photo: String
});

const transmissionSchema = new mongoose.Schema({
    name: String,
    acceleration: String,
    price: Number,
    photo: String
});

const carSchema = new mongoose.Schema({
    name: String,
    color: String,
    price: Number,
    engine: {
        type: mongoose.Schema.ObjectId,
        ref: 'Engine'
    },
    transmission: {
        type: mongoose.Schema.ObjectId,
        ref: 'Transmission'
    }
});

const Car = mongoose.model('Car', carSchema);
const Engine = mongoose.model('Engine', engineSchema);
const Transmission = mongoose.model('Transmission', transmissionSchema);

app.post('/api/cars', async (req, res) => {
    const car = new Car({
        name: req.body.name,
        color: req.body.color,
        price: 10000,
        engine: null,
        transmission: null
    });
    try {
        await car.save();
        res.send(car);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/cars/:carid', async (req, res) => {
    try {
        let car = await Car.findOne({_id:req.params.carid});
        if (!car) {
            res.send(404);
            return;
        }
        car.name = req.body.name;
        car.color = req.body.color;
        await car.save();
        res.send(car);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/api/cars', async (req, res) => {
    try {
        let cars = await Car.find();
        res.send(cars);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/engines', async (req, res) => {
    try {
        let engines = await Engine.find();
        res.send(engines);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/transmissions', async (req, res) => {
    try {
        let transmissions = await Transmission.find();
        res.send(transmissions);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/cars/:carid/engine/:engineid', async (req, res) => {
    try {
        let engine = await Engine.findOne({_id:req.params.engineid});
        if (!engine) {
            res.send(404);
            console.log("Engine not found");
            return;
        }
        let car = await Car.findOne({_id:req.params.carid});
        if (!car) {
            res.send(404);
            console.log("Car not found");
            return;
        }
        if (car.engine) {
            let oldEngine = await Engine.findOne({_id:car.engine});
            car.price = car.price - oldEngine.price;
        }
        car.engine = engine;
        car.price = car.price + car.engine.price;
        await car.save();
        res.send(car);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/cars/:carid/engine', async (req, res) => {
    try {
        let car = await Car.findOne({_id:req.params.carid});
        if (!car) {
            res.send(404);
            return;
        }
        if (car.engine) {
            let oldEngine = await Engine.findOne({_id:car.engine});
            car.price = car.price - oldEngine.price;
            car.engine = null;
            await car.save();
        }
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/cars/:carid/transmission/:transmissionid', async (req, res) => {
    try {
        let transmission = await Transmission.findOne({_id:req.params.transmissionid});
        if (!transmission) {
            res.send(404);
            return;
        }
        let car = await Car.findOne({_id:req.params.carid});
        if (!car) {
            res.send(404);
            return;
        }
        if (car.transmission) {
            let oldTransmission = await Transmission.findOne({_id:car.transmission});
            car.price = car.price - oldTransmission.price;
        }
        car.transmission = transmission;
        car.price = car.price + car.transmission.price;
        await car.save();
        res.send(car);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/cars/:carid/transmission', async (req, res) => {
    try {
        let car = await Car.findOne({_id:req.params.carid});
        if (!car) {
            res.send(404);
            return;
        }
        if (car.transmission) {
            let oldTransmission = await Transmission.findOne({_id:car.transmission});
            car.price = car.price - oldTransmission.price;
            car.transmission = null;
            await car.save();
        }
        await car.save();
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/cars/:carid', async (req, res) => {
    try {
        let car = await Car.findOne({_id:req.params.carid});
        if (!car) {
            res.send(404);
            return;
        }
        await car.delete();
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(2800, () => console.log('Server listening on port 2800!'));

