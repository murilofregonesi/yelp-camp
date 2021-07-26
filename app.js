const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');


// App
const app = express();
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`APP listening on PORT ${PORT}`)
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

// Database
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
