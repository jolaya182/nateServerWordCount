/**
 * title: GroupedActivityController.js
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this file controls the incoming data, invokes some model processes and responds to the request
 */
// require in the model and export an object. give the object
const GroupedActivitiesModel = require('../models/GroupedActivitiesModel');

// all the methods your want in order to make the model calls to the database
// initalize all orm and mvc design patterns necessary

const GAM = new GroupedActivitiesModel('./server/dailyData.csv');

const GroupedActivityController = {};
/**
 *fetch, process incoming data and pocess and returns all the grouped event activities of the agenda
 *
 * @param {*} { req, res, next}
 * @returns string
 */
GroupedActivityController.loadData = (req, res, next) => {
  const StartEndAgendaRange = req.body;

  const dailyData = GAM.loadGroupedActivities();
  if (dailyData.error) res.send({ error: dailyData.error });
  GAM.processGroupedActivities(StartEndAgendaRange);
  GAM.populateGroupedActivities();
  // find all overlapping eventActivities
  GAM.groupOverLappingEventActivities();

  res.send(GAM.sendGroupedActivities());
  next();
};

module.exports = GroupedActivityController;
