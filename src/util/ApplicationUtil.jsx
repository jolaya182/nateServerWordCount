/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default */
/* eslint-disable react/jsx-one-expression-per-line */
/**
 * title: ApplicationUtil.jsx
 *
 * date: //2020
 *
 * author: javier olaya
 *
 * description: this component handles the Agenda and event schedule aspect of the webpage
 */
import React from 'react';

/**
 * return stringified object
 *
 * @param {object} incomingObject
 * @returns
 */
export const serializer = incomingObject => {
  return JSON.stringify(incomingObject);
};

/**
 *returns object from the given string
 *
 * @param {string} incomingString
 * @returns
 */
export const deserializer = incomingString => {
  return JSON.parse(incomingString);
};
/**
 *mitigation plan for when the data does not show on the screen.dummy data is displayed.
 *
 * @param {object} dataFromConstantFile
 * @param {Function} thisState
 */
export const ServerRequestFailureMitigationPlan = dataFromConstantFile => {
  console.log('Server Request Failure Mitigation Plan executing');
  return deserializer(dataFromConstantFile);
};

/**
 * prints message using console.log
 *
 * @param {string} message
 * @param {error} error
 */
export const printConsoleErrorMessage = (message, error) => {
  // console.log(message, error);
  throw new Error('error message was caught');
};

/**
 *takes in a callback function and upon a successfull request it invokes 
 the callback function and returns a promise
 *
 * @param {*} url
 * @param {*} method
 * @param {*} callBackFunction
 * @param {*} data
 * @returns promise
 */
export const fetchExecuteCallbackFunction = (
  url,
  method,
  callBackFunction,
  data
) => {
  const options = data
    ? {
        body: JSON.stringify(data),
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    : {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

  return fetch(url, options)
    .then(
      response => {
        return response.json();
      },
      error => {
        this.printConsoleErrorMessage(
          'fetch failed due to error, check if server is running',
          error
        );
      }
    )
    .then(
      json => {
        const { status } = json;
        if (status >= 400 && status < 500) {
          printConsoleErrorMessage('failed on the client side due to ', status);
        } else if (status >= 500 && status <= 599) {
          printConsoleErrorMessage('failed on the server side due to ', status);
        }
        console.log('fetch request was a success');
        // console.log(JSON.stringify(json));
        // return json;
        return callBackFunction(json);
      },
      error =>
        printConsoleErrorMessage(
          'error sending the request, check the url address',
          error
        )
    )
    .catch(error => {
      console.log('error message caught', error.message);
      // return error;
    });
};

/**
 * returns a string sorted array
 *
 * @param {array} icomingArray
 * @returns array
 */
const sortArrayKeys = icomingArray => {
  return icomingArray.sort((a, b) => a + b);
};

/**
 * does a recursive check to see if the state object keys have the same as the
 * response keys
 *
 * @param {*} state
 * @param {*} response
 * @returns
 */
export const areFetchRequestResponsePropertyNamesValid = (state, response) => {
  if (response) {
    // case 1
    // if there are no keys return the empty object response and console log empty key object
    const responseKeys = sortArrayKeys(Object.keys(response));
    if (responseKeys.length === 0) {
      // 'no object to update, incoming object is empty with variable `response`',
      return true;
    }
    const stateKeys = sortArrayKeys(Object.keys(state));
    // go through every key
    stateKeys.forEach(stateKey => {
      // case 2
      // if the value of a key is an object then recurse
      if (
        typeof state[stateKey] === 'object' &&
        state[stateKey] !== null &&
        !Array.isArray(state[stateKey])
      ) {
        console.log('recurse ', stateKey, ':', state[stateKey]);

        const willContinueSearch = areFetchRequestResponsePropertyNamesValid(
          state[stateKey],
          response[stateKey]
        );
        if (!willContinueSearch) return willContinueSearch;
      }

      try {
        for (let indx = 0; indx < responseKeys.length; indx += 1) {
          const responseKey = responseKeys[indx];
          // stateKey and responseKey match', responseKey
          if (stateKey === responseKey) {
            return true;
          }
        }
        throw new Error(stateKey);
      } catch (error) {
        console.error(
          `-> stateKey '${stateKey}' does not match response key: ${error.message}`
        );
      }
    });
  } else {
    console.log('the incoming response value is not a valid value: ', response);
    return false;
  }
};
