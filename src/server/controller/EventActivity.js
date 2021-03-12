/* eslint-disable no-nested-ternary */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-destructuring */
/**
 * title: EventActivity.js
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this file handles eventActivity properties
 */
/**
 *the unit for every event on the agenda application
 *
 * @class EventActivity
 */
class EventActivity {
  constructor(evnt) {
    this.timeUnitPX = 54;
    this.timeUnit = 30;
    this.eventId = evnt[0];
    this.eventName = evnt[1];
    this.eventStart = evnt[2];
    this.eventDuration = evnt[3];
    this.eventLocation = evnt[4];
    this.eventAllDay = evnt[5];
    this.topPosition = this.calculatePosition(evnt[2]);
    this.bottomPosition = this.topPosition + evnt[3];
    this.regulartime = this.getRegularTime();
    this.eventHeight = this.calculateHeight();
  }

  /**
   * returns the start hour of the event acitivity
   *
   * @returns intger
   * @memberof EventActivity
   */
  getEventHourStart() {
    return this.eventStart.getHours() + this.eventStart.getMinutes() / 60;
  }

  /**
   * returns the start time in javascript  Date format
   *
   * @returns intger
   * @memberof EventActivity
   */
  getEventStart() {
    return this.eventStart;
  }

  /**
   *returns a how long the events lasts in units of 30 minutes
   *
   * @returns intger
   * @memberof EventActivity
   */
  getEventDuration() {
    return this.eventDuration;
  }

  /**
   * returns the time when the event finishes
   *
   * @returns intger
   * @memberof EventActivity
   */
  getEventEnd() {
    return this.eventStart + this.eventDuration;
  }

  /**
   *updates the event activity start time
   *
   * @param {*} newPosition
   * @memberof EventActivity
   */
  setTopPosition(newPosition) {
    this.topPosition = newPosition;
  }

  /**
   *updates the bottom position of event activity
   *
   * @param {*} newPosition
   * @memberof EventActivity
   */
  setBottomPosition(newPosition) {
    this.bottomPosition = newPosition;
  }

  /**
   * returns the top left position of the eventActivity
   *
   * @returns intger
   * @memberof EventActivity
   */
  getTopPosition() {
    return this.topPosition;
  }

  /**
   *returns the bottom position of event activity
   *
   * @returns intger
   * @memberof EventActivity
   */
  getBottomPosition() {
    return this.bottomPosition;
  }

  /**
   * returns the unit per pixel of the web application
   *
   * @returns intger
   * @memberof EventActivity
   */
  getTimeUnitPx() {
    return this.timeUnitPX;
  }

  /**
   *calculate the event activity position in pixels
   *
   * @param {*} time
   * @returns intger
   * @memberof EventActivity
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
   *returns the height length of the event activity
   *
   * @returns intger
   * @memberof EventActivity
   */
  calculateHeight() {
    return this.timeUnitPX * (this.eventDuration / this.timeUnit);
  }

  /**
   *returns the regular timer format
   *
   * @returns string
   * @memberof EventActivity
   */
  getRegularTime() {
    const evntStart = this.eventStart;
    const evntDate = new Date(evntStart);
    const militaryTime = evntDate.getHours();

    const morningNight = militaryTime < 12 ? 'AM' : 'PM';
    const hour =
      militaryTime > 0 && militaryTime < 13
        ? militaryTime
        : militaryTime === 0
        ? 12
        : militaryTime - 12;
    const minutes = evntDate.getMinutes() === 0 ? '00' : evntDate.getMinutes();
    const regulartime = `${hour}:${minutes}${morningNight}-`;
    return regulartime;
  }
}

module.exports = EventActivity;
