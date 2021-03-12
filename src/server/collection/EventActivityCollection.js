/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/**
 * title: EventActivityCollection.js
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this file handles the collection delete search and updates all the event activities
 */
const Collection = require('../controller/Collection');
const EventActivity = require('../controller/EventActivity');

/**
 * The class holds all of the event activities inside of a grouped event activity of the web application
 *
 * @class EventActivityCollection
 * @extends {Collection}
 */
class EventActivityCollection extends Collection {
  constructor(incomingEventActivityData) {
    super();
    this.data = [incomingEventActivityData];
  }

  /**
   *updates the event activity collection
   *
   * @param {*} incomingEventActivityData
   * @memberof EventActivityCollection
   */
  addAll(incomingEventActivityData) {
    const IncomingEventActivity = incomingEventActivityData.map(evnt => {
      return new EventActivity(evnt);
    });

    this.data = IncomingEventActivity.map(event => new EventActivity(event));
  }

  /**
   *returns all the event activities
   *
   * @returns array
   * @memberof EventActivityCollection
   */
  getAll() {
    return this.data;
  }

  /**
   * returns the first event activity instance of the group
   *
   * @returns object
   * @memberof EventActivityCollection
   */
  getFirstEventActivity() {
    return this.data[0];
  }

  /**
   * reutrns the last event activity instance of the group
   *
   * @returns object
   * @memberof EventActivityCollection
   */
  getLastEventActivity() {
    return this.data[this.data.length - 1];
  }

  /**
   * adds an event activity to the collection
   *
   * @param {*} eventActivity
   * @memberof EventActivityCollection
   */
  addEventActivity(eventActivity) {
    this.data.push(eventActivity);
  }

  /**
   * deletes an event activity frome the collection
   *
   * @param {*} dataId
   * @memberof EventActivityCollection
   */
  removeEventActivity(dataId) {
    this.data = this.data.filter(dataObj => dataObj.eventId !== dataId);
  }
}

module.exports = EventActivityCollection;
