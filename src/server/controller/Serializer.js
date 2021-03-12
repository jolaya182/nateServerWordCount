/* eslint-disable class-methods-use-this */
/**
 * title: Serializer.js
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this file handles the serialization and deserialization of icoming and outgoing data
 */
/**
 * stringifies all objects and destringifies.
 *
 * @class Serializer
 */
class Serializer {
  /**
   * serialize
   *
   * @param {*} GroupedEventActivities
   * @returns string
   * @memberof Serializer
   */
  serialize(groupedEventActivities) {
    return JSON.stringify(groupedEventActivities);
  }

  /**
   *deserialize
   *
   * @param {*} incomingString
   * @returns json object
   * @memberof Serializer
   */
  deserialize(incomingString) {
    return JSON.parse(incomingString);
  }
}

module.exports = Serializer;
