/**
 * title: Collection.js
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this file is the collection super class
 */
/**
 * base collection for all other sub collections
 *
 * @class Collection
 */
class Collection {
  constructor() {
    this.data = [];
  }

  /**
   * updates a new collection
   *
   * @param {*} incomingData
   * @memberof Collection
   */
  addAll(incomingData) {
    this.data = incomingData;
  }

  /**
   *updates a record for this collection
   *
   * @param {*} data
   * @memberof Collection
   */
  add(data) {
    this.data.push(data);
  }

  /**
   * deletes all in the collection
   *
   * @memberof Collection
   */
  removeAll() {
    this.data = [];
  }
}

module.exports = Collection;
