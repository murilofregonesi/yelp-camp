const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const ejs = require('ejs');
const mongoose = require('mongoose');
const path = require('path');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const campgroundsRouter = require('./routes/campgrounds');
const reviewsRouter = require('./routes/reviews');


// App
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/reviews', reviewsRouter);

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode=500 } = err;
    if (!err.message) err.message = 'Error';
    res.status(statusCode).render('error', { err });
})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`APP listening on PORT ${PORT}`)
});

// Database
const DB_HOST = 'localhost';
const DB_NAME = 'yelpCamp';
const DB_PORT = 27017;

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(res => {
    console.log(`Connected to MongoDB on PORT ${DB_PORT}`);
})
.catch(err => {
    console.log(`FAILED to connect to MongoDB \n${err}`);
});
