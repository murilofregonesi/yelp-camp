const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const { wrapAsync } = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


// App
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/campgrounds', catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    })
);

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
});

app.post('/campgrounds', catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground })
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground })
}));

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id)
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.use((err, req, res, next) => {
    res.send('Oh boy...');
})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`APP listening on PORT ${PORT}`)
});

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
