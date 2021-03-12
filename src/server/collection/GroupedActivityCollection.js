/* eslint-disable consistent-return */
/**
 * title:GroupedActivityCollection.js
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this file handles the collection regroup, search and updates all the group activities
 */
const Collection = require('../controller/Collection');

/**
 * this class holds all of the grouped event activities of the web application
 *
 * @class GroupedActivityCollection
 * @extends {Collection}
 */
class GroupedActivityCollection extends Collection {
  constructor(incomingEventActivityData) {
    super();
    this.data = [incomingEventActivityData];
    // this.addAll(incomingEventActivityData);
  }

  /**
   * updates the grouped activites collection
   *
   * @param {*} incomingEventActivityData
   * @memberof GroupedActivityCollection
   */
  addAll(incomingEventActivityData) {
    this.data = incomingEventActivityData;
  }

  /**
   *adds a grouped event activity to the collection
   *
   * @param {*} groupedActivity
   * @memberof GroupedActivityCollection
   */
  addGroupedActivity(groupedActivity) {
    this.data.push(groupedActivity);
  }

  /**
   * empties out the grouped activity collection
   *
   * @memberof GroupedActivityCollection
   */
  removeAll() {
    this.data = [];
  }

  /**
   *filters out the grouped activity that should be deleted
   *
   * @param {*} dataId
   * @memberof GroupedActivityCollection
   */
  removeEventActivity(dataId) {
    this.data = this.data.filter(dataObj => dataObj.id !== dataId);
  }

  /**
   *returns all overlapping event activities
   *
   * @returns array
   * @memberof GroupedActivityCollection
   */
  groupOverLappingEventActivities() {
    // create a new collection where the all overlapping events will
    // be grouped together
    const currentGroupedActivityCollection = this.data;

    let currentGroupedIndx = null;

    const regroupedEventActivities = currentGroupedActivityCollection.filter(
      (currentGroupedActivity, indx) => {
        if (indx === 0) return currentGroupedActivity;

        // get previous grouped activity
        const prevGroupedActivity = currentGroupedActivityCollection[indx - 1];

        // check if the current grouped activities top overlaps with the previous vertical length
        if (
          currentGroupedActivity.getTopPosition() >=
            prevGroupedActivity.getTopPosition() &&
          currentGroupedActivity.getTopPosition() <
            prevGroupedActivity.getBottomPosition()
        ) {
          if (currentGroupedIndx === null) currentGroupedIndx = indx - 1;

          // widen the bottom
          const topGroupedActivity =
            currentGroupedActivityCollection[currentGroupedIndx];
          topGroupedActivity.setBottomPosition(
            currentGroupedActivity.getBottomPosition()
          );
          // add the currentGroupedActivity events to the topGroupedActivity
          topGroupedActivity.addEventActivity(
            currentGroupedActivity
              .getEventActivityCollection()
              .getFirstEventActivity()
          );

          return false;
        }
        currentGroupedIndx = null;
        return currentGroupedActivity;
      }
    );
    this.data = regroupedEventActivities;
    return this.data;
  }
}

module.exports = GroupedActivityCollection;
