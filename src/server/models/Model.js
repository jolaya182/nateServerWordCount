/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/**
 * title: Model.js
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this file is the super class for all other submodels
 */
const fs = require('fs');
const Collection = require('../controller/Collection');

/**
 * base model for all other sub classes
 *
 * @class Model
 */
class Model {
  constructor(modelData) {
    this.modelData = new Collection(modelData);
  }

  //
  /**
   *fetch data the data source
   *
   * @param {*} source
   * @returns
   * @memberof Model
   */
  fetchData(source) {
    const dailyData = fs.readFileSync(source, 'utf8', (error, data) => {
      if (error) {
        console.log('error in get request', error);
        return { error };
      }
      return data;
    });
    if (dailyData.error) return dailyData;
    return dailyData;
  }

  // processFetched data
  // load data
  // get data
  // delete record
}

module.exports = Model;
