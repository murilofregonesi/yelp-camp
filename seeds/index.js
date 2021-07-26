const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');


const DB_HOST = 'localhost';
const DB_NAME = 'yelpCamp';
const DB_PORT = 27017;

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(res => {
    console.log(`Connected to MongoDB on PORT ${DB_PORT}`);
})
.catch(err => {
    console.log(`FAILED to connect to MongoDB \n${err}`);
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i=0; i<50; i++) {
        let index = Math.floor(Math.random() * cities.length);
        const new_camp = new Campground({
            location: `${cities[index].city}, ${cities[index].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });
        await new_camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});
