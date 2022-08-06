const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./config');

const isDevMode = process.env.NODE_ENV === 'development' || false;
// const isProdMode = process.env.NODE_ENV === 'production' || false;

let mongoUrl = config.MONGO_DOCKER_URL;
if (isDevMode) {
  mongoUrl = config.MONGO_LOCAL_URL;
}
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to Database');
  }).catch((err) => {
    console.log('Not Connected to Database ERROR! ', err);
  });
mongoose.Promise = global.Promise;

// routes
const cacheRoutes = require('./api/routes/cache');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handling cross origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  );
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,PATCH,DELETE');
  next();
});

// middleware
app.use('/api/cache', cacheRoutes);

// error handling
app.use((req, res, next) => {
  const error = Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
