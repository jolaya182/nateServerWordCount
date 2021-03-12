/**
 * title: GroupedActivities.js
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this file handles the unit that can hold multiple event activities
 */
const EventActivityCollection = require('../collection/EventActivityCollection');

/**
 * single container for event activities
 *
 * @class GroupedActivities
 */
class GroupedActivities {
  constructor(evnts) {
    this.timeUnitPX = evnts.getTimeUnitPx();
    this.timeUnit = 30;
    this.topPosition = evnts.getTopPosition();
    this.bottomPosition = evnts.getBottomPosition();
    this.eventActivityCollection = new EventActivityCollection(evnts);
    this.numberOfGroupedActivities = 1;
  }

  /**
   * returns grouped application top position
   *
   * @returns integer
   * @memberof GroupedActivities
   */
  getTopPosition() {
    return this.topPosition;
  }

  /**
   * returns the bottom position of the grouped event activities
   *
   * @returns integer
   * @memberof GroupedActivities
   */
  getBottomPosition() {
    return this.bottomPosition;
  }

  /**
   * updates top position of the grouped event activities
   *
   * @param {*} newTopPosition
   * @memberof GroupedActivities
   */
  setTopPosition(newTopPosition) {
    this.topPosition = newTopPosition;
  }

  /**
   *updates the bottom position of the grouped event activities
   *
   * @param {*} newBottomPosition
   * @memberof GroupedActivities
   */
  setBottomPosition(newBottomPosition) {
    this.bottomPosition = newBottomPosition;
  }

  /**
   * returns the top position of the grouped event activities
   *
   * @param {*} time
   * @returns integer
   * @memberof GroupedActivities
   */
  calculatePosition(time) {
    return (
      this.timeUnitPX *
      Math.floor(
        (new Date(time).getHours() * 60 + new Date(time).getMinutes()) /
          this.timeUnit
      )
    );
  }

  /**
   * adds a grouped activity to the collection
   *
   * @param {*} evnt
   * @memberof GroupedActivities
   */
  addEventActivity(evnt) {
    this.eventActivityCollection.addEventActivity(evnt);
    this.numberOfGroupedActivities += 1;
  }

  /**
   * adds an event activities collection to the grouped activities
   *
   * @param {*} incomingEventActivityCollection
   * @memberof GroupedActivities
   */
  addEventActivityCollection(incomingEventActivityCollection) {
    incomingEventActivityCollection.data.forEach(eventActivity => {
      this.eventActivityCollection.data.push(eventActivity);
    });
    this.numberOfGroupedActivities += incomingEventActivityCollection.length;
    this.setTopPosition(
      incomingEventActivityCollection.getFirstEventActivity().getEventStart()
    );
    this.setBottomPosition(
      incomingEventActivityCollection.getLastEventActivity().getEventEnd()
    );
  }

  /**
   *gets all the events from the grouped event activities
   *
   * @returns array
   * @memberof GroupedActivities
   */
  getEventActivityCollection() {
    return this.eventActivityCollection;
  }
}

module.exports = GroupedActivities;
