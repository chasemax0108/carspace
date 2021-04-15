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

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: ['secretValue'],
    cookie: {
        maxAge: 24*60*60*1000
    }
}));

const users = require("./users.js");
app.use("/api/users", users.routes);
const User = users.model;
const validUser = users.valid;

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
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

const Car = mongoose.model('Car', carSchema);
const Engine = mongoose.model('Engine', engineSchema);
const Transmission = mongoose.model('Transmission', transmissionSchema);


/*/////////////////////////////////////////////////////////////////////////////////////////

                                ENDPOINTS

*////////////////////////////// POST A NEW CAR //////////////////////////////////
app.post('/api/cars', validUser, async (req, res) => {
    const car = new Car({
        name: req.body.name,
        color: req.body.color,
        price: 10000,
        engine: null,
        transmission: null,
        user: req.user
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

/////////////////////////////// UPDATE A CAR /////////////////////////////////////
app.put('/api/cars/:carid', validUser, async (req, res) => {
    try {
        let car = await Car.findOne({_id:req.params.carid, user:req.user});
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

//////////////////////////// GET ALL CARS /////////////////////////////////
app.get('/api/cars', validUser, async (req, res) => {
    try {
        let cars = await Car.find({
            user: req.user
        });
        res.send(cars);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/////////////////////////// GET ALL ENGINES //////////////////////////////
app.get('/api/engines', async (req, res) => {
    try {
        let engines = await Engine.find();
        res.send(engines);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

///////////////////////// GET ALL TRANSMISSIONS ///////////////////////////
app.get('/api/transmissions', async (req, res) => {
    try {
        let transmissions = await Transmission.find();
        res.send(transmissions);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

///////////////////////// ADD ENGINE TO A CAR ////////////////////////////
app.put('/api/cars/:carid/engine/:engineid', validUser, async (req, res) => {
    try {
        let engine = await Engine.findOne({_id:req.params.engineid});
        if (!engine) {
            res.send(404);
            console.log("Engine not found");
            return;
        }
        let car = await Car.findOne({_id:req.params.carid, user: req.user});
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

//////////////////////////// REMOVE ENGINE FROM A CAR /////////////////////
app.delete('/api/cars/:carid/engine', validUser, async (req, res) => {
    try {
        let car = await Car.findOne({_id:req.params.carid, user:req.user});
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

///////////////////////////// ADD TRANSMISSION TO A CAR ////////////////////////
app.put('/api/cars/:carid/transmission/:transmissionid', validUser, async (req, res) => {
    try {
        let transmission = await Transmission.findOne({_id:req.params.transmissionid});
        if (!transmission) {
            res.send(404);
            return;
        }
        let car = await Car.findOne({_id:req.params.carid, user:req.user});
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

///////////////////////////// REMOVE TRANSMISSION FROM A CAR ///////////////////////////////
app.delete('/api/cars/:carid/transmission', validUser, async (req, res) => {
    try {
        let car = await Car.findOne({_id:req.params.carid, user:req.user});
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

//////////////////////////////// DELETE A CAR /////////////////////////////////////////
app.delete('/api/cars/:carid', validUser, async (req, res) => {
    try {
        let car = await Car.findOne({_id:req.params.carid, user:req.user});
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

