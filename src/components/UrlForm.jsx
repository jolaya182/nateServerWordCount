/* eslint-disable consistent-return */
/**
 * title: index.js
 *
 * date: 3/22/2020
 *
 * author: javier olaya
 *
 * description: this file handles all the form submission and words rendering
 */
import React, { useState, useRef, useEffect } from 'react';

import serverUrl from './utilComponentData/constants';

/**
 *  form component used to get a word count from the url the
 *  user's url submission
 *
 * @return {Html element}
 */
const UrlForm = () => {
  const [words, upatedWords] = useState([]);
  const [historyUrl, updateHistory] = useState([]);
  const [currentSelectedUrl, setSelectedUrl] = useState('');
  const [errorMessage, updateErrorMessage] = useState('');
  const [loadingMessage, updateLoadMessage] = useState(false);
  const urlText = useRef(null);

  /**
   *  does a post request with a formdata object
   *
   * @param {*} form
   */
  const urlRequest = (form) => {
    const options = {
      method: 'POST',
      body: form
    };

    fetch(serverUrl, options)
      .then(
        (response) => response.json(),
        (error) => {
          updateErrorMessage(error);
          console.log('error---> 1', error.message);
        }
      )
      .then(
        (json) => {
          upatedWords(json.data);
          updateHistory(json.historyUrl);
          setSelectedUrl(json.currentSelectedUrl);
          updateLoadMessage(false);
          updateErrorMessage('');
          return json;
        },
        (error) => {
          updateErrorMessage('please type in a legit url');
          updateLoadMessage(false);
          console.log('error***> 2', error.message);
        }
      )
      .catch((error) => {
        updateErrorMessage(error.message);
        updateLoadMessage(false);
        console.log('error message caught 3', error.message);
        // return error;
      });
  };

  /**
   *  submits a url search from the input form
   *
   * @param {*} e
   */
  const submit = (e) => {
    // make the post request
    e.preventDefault();
    const form = new FormData();
    const url = urlText.current.value;
    const selectedUrl = '';
    // assure that the user places in a text before submiting
    let urlString = null;
    if (url || url.length > 0) {
      urlString = url;
    }
    form.append('urlText', urlString);
    form.append('selectedUrl', selectedUrl);
    updateLoadMessage(true);
    urlRequest(form);
  };

  /**
   *  updates  the message and the fetches the word count
   *  based on the url selected
   *
   * @param {*} e
   */
  const onChangeSelect = (e) => {
    e.preventDefault();
    const selectedValue = e.target.value;
    const form = new FormData();
    form.append('urlText', null);
    form.append('selectedUrl', selectedValue);
    updateLoadMessage(true);
    urlRequest(form);
  };

  /**
   *function that avoids triggering other functions to quickly
   *
   * @param {*} func
   * @param {*} delay
   * @return {*}
   */
  const debounce = (func, delay) => {
    let timeout;
    return function funExecuted(...args) {
      const later = () => {
        timeout = null;
        func(...args);
      };
      // reset the clock after every click
      clearTimeout(timeout);
      timeout = setTimeout(later, delay);
    };
  };

  // helps prevent the user requesting multiple
  // click before receiving the servers data
  debounce(submit, 1200);

  /**
   *  retrieve the initial data that may be stored on the server
   *
   * @return {*}
   */
  useEffect(() => {
    // delete initial data
    const form = new FormData();
    form.append('fetchUrls', true);
    urlRequest(form);
  }, []);

  return (
    <div>
      <form id="nateForm" encType="multipart/form-data">
        <input type="text" placeholder="type your url" ref={urlText} />
        <button type="button" onClick={submit}>
          submit
        </button>
        <select value={currentSelectedUrl} onChange={onChangeSelect}>
          {historyUrl.map((url, index) => (
            <option value={url} key={`nate-select-${index}`}>
              {url}
            </option>
          ))}
        </select>
      </form>
      <div>{errorMessage}</div>
      {loadingMessage ? (
        `Loading Word Count...`
      ) : (
        <section>
          {words.map((word, index) => {
            return (
              <div key={`nate-words${index}`}>
                <div>{`${word.word}: ${word.count}`}</div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default UrlForm;
