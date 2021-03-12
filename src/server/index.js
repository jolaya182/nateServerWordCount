/**
 * title: index.js
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this file handles all the end points for the 'agenda' application requrests
 */
// call in express
const express = require('express');
// invoke express
const app = express();
// port = 3000
const port = 3000;
// parse the data coming in
const bodyPaser = require('body-parser');

const GroupedActivityController = require('./controller/GroupedActivityController');

app.use(bodyPaser.urlencoded({ extended: true }));
app.use(bodyPaser.json());

/**
 *set the headers
 *
 * @param {*} { req, res, next}
 * @returns
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

/**
 *respond to post, incoming data is the star time and end time of the agenda application
 *
 * @param {*} { req, res, next}
 * @returns
 */
app.post(
  '/reactAgendaData',
  (req, res, next) => {
    console.log('post reactAgendaData requestss');
    next();
  },
  GroupedActivityController.loadData
);

app.listen(port, () => console.log('listening to port:', port));
