/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/**
 * title: GroupedActivitiesModel.js
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this file handles basic fetch, popluate and regroup functionalities of the web application
 */
const Model = require('./Model');
const GroupedActivityCollection = require('../collection/GroupedActivityCollection');
const GroupedActivities = require('../controller/GroupedActivities');
const EventActivity = require('../controller/EventActivity');
const Serializer = require('../controller/Serializer');

/**
 *
 *
 * @class GroupedActivitiesModel
 * @extends {Model}
 */
class GroupedActivitiesModel extends Model {
  constructor(source) {
    super();
    this.source = source;
    this.groupedActivitiesModelCollection = [];
    this.AllDayEventActivities = [];
  }

  /**
   * fetches data from the data source
   *
   * @returns array
   * @memberof GroupedActivitiesModel
   */
  loadGroupedActivities() {
    const dailyData = this.fetchData(this.source);
    this.groupedActivitiesModelCollection = dailyData;
    return dailyData;
  }

  /**
   * splits the return data string, sorts it by event start time(ascending), filters
   * the events from a given start and end range and finally separate 'all day events'
   * from the rest of the events
   *
   * @param {*} StartEndAgendaRange
   * @memberof GroupedActivitiesModel
   */
  processGroupedActivities(StartEndAgendaRange) {
    const unProcessedIncomingEvents = this.groupedActivitiesModelCollection;

    const dailyDataSplited = unProcessedIncomingEvents.split(/\r?\n/);
    //   get ride of the attribute row
    dailyDataSplited.shift();

    // sort the events based on their start times in ascending order
    const dailyDataSplitedStringSeperated = dailyDataSplited.map(evnt => {
      const evntProperties = evnt.split(/,/);
      return new EventActivity(
        this.changeStringsToDateAndNumber(evntProperties)
      );
    });

    const dailySplitSortedData = this.sortGroupedActivities(
      dailyDataSplitedStringSeperated
    );

    const allGroupedEventsWithinStartAndEndRange = this.filterGroupedEventsWithinRange(
      dailySplitSortedData,
      StartEndAgendaRange
    );

    const filteredAllEvents = this.filterAllDayEvents(
      allGroupedEventsWithinStartAndEndRange
    );

    this.AllDayEventActivities = filteredAllEvents.allDayEvents;
    this.groupedActivitiesModelCollection =
      filteredAllEvents.dailySplitSortedData;
  }

  /**
   * returns all day events and non all day events
   *
   * @param {*} dailySplitSortedData
   * @returns object
   * @memberof GroupedActivitiesModel
   */
  filterAllDayEvents(dailySplitSortedData) {
    const allDayEvents = dailySplitSortedData.filter(evnt => evnt.eventAllDay);

    const nonAllDayEvents = dailySplitSortedData.filter(
      evnt => !evnt.eventAllDay
    );

    return {
      dailySplitSortedData: nonAllDayEvents,
      allDayEvents
    };
  }

  /**
   * converts the IDs, event duration into numbers, allDayevents into booleans
   * and string dates into a Date object
   *
   * @param {*} evntProperties
   * @returns array
   * @memberof GroupedActivitiesModel
   */
  changeStringsToDateAndNumber(evntProperties) {
    evntProperties[0] = Number(evntProperties[0]);
    evntProperties[2] = new Date(evntProperties[2]);
    evntProperties[3] = Number(evntProperties[3]);
    evntProperties[5] = evntProperties[5] === 'TRUE';
    return evntProperties;
  }

  /**
   *sorts the incoming event activities by event's start time
   *
   * @param {*} dailyDataSplitedStringSeperated
   * @returns array
   * @memberof GroupedActivitiesModel
   */
  sortGroupedActivities(dailyDataSplitedStringSeperated) {
    const values = dailyDataSplitedStringSeperated.sort(
      (a, b) => a.eventStart - b.eventStart
    );
    return values;
  }

  /**
   *find all overlapping eventActivities and filter the ones that are needed on the agenda
   *
   * @param {*} dailyDataSplitedStringSeperated
   * @param {*} StartEndAgendaRange
   * @returns
   * @memberof GroupedActivitiesModel
   */
  filterGroupedEventsWithinRange(
    dailyDataSplitedStringSeperated,
    StartEndAgendaRange
  ) {
    const { startTime } = StartEndAgendaRange;
    return dailyDataSplitedStringSeperated.filter(evnt => {
      const entStart = evnt.getEventHourStart();
      if (entStart >= startTime) {
        const newStartTime =
          (Math.abs(entStart - startTime) * 2 - 2) * evnt.getTimeUnitPx();
        evnt.setTopPosition(newStartTime);
        evnt.setBottomPosition(newStartTime + evnt.getEventDuration());

        return evnt;
      }

      return false;
    });
  }

  /**
   *creates the grouped activities collection and adds it the model collection
   *
   * @memberof GroupedActivitiesModel
   */
  populateGroupedActivities() {
    const allGroupedActivities = this.groupedActivitiesModelCollection.map(
      evnt => new GroupedActivities(evnt)
    );
    this.groupedActivitiesModelCollection = new GroupedActivityCollection();
    this.groupedActivitiesModelCollection.addAll(allGroupedActivities);
  }

  /**
   * finds all over lapping events in the day
   *
   * @returns array
   * @memberof GroupedActivitiesModel
   */
  groupOverLappingEventActivities() {
    const returnedValue = this.groupedActivitiesModelCollection.groupOverLappingEventActivities();
    return returnedValue;
  }

  /**
   *returns the grouped activity collection
   *
   * @returns array
   * @memberof GroupedActivitiesModel
   */
  getGroupedActivitiesModelCollection() {
    return this.groupedActivitiesModelCollection.data;
  }

  /**
   * gets the all day events
   *
   * @returns array
   * @memberof GroupedActivitiesModel
   */
  getAllDayEvents() {
    return this.AllDayEventActivities;
  }

  /**
   *stringifys all grouped activities that will be sent to the client
   *
   * @returns string
   * @memberof GroupedActivitiesModel
   */
  sendGroupedActivities() {
    const serialize = new Serializer();
    return serialize.serialize({
      allDayEvents: this.getAllDayEvents(),
      groupedActivitiesModelCollection: this.getGroupedActivitiesModelCollection(),
      startTime: 9,
      endTime: 20
    });
  }
}

module.exports = GroupedActivitiesModel;
