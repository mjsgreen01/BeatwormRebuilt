const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

//set up express app
const app = express();

//log requests to console
app.use(logger('dev'));

//parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//routes
require('./server/routes')(app);
//default route to send back a welcome message
// app.get('*', (req, res) => res.status(200).send({
//   message: 'Welcome to the bottom bunk',
// }))

module.exports = app;
