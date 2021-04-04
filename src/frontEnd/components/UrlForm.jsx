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
import 'bootstrap/dist/css/bootstrap.css';

import Paginator from './Paginator';
import NateForm from './NateForm';
import WordTable from './WordTable';
import serverUrl from './utilComponentData/constants';
import '../css/index.css';

/**
 *  form component used to get a word count from the url the
 *  user's url submission
 *
 * @return {Html element}
 */
const UrlForm = () => {
  const [words, upatedWords] = useState([]);
  const [historyUrl, updateHistory] = useState(['Select a Url']);
  const [currentSelectedUrl, setSelectedUrl] = useState({
    urlString: '',
    urlId: 0
  });
  const [currentUrlNameToUpdate, setUpdateCurrentUrlName] = useState('');
  const [errorMessage, updateErrorMessage] = useState('');
  const [paginatorObject, updatePaginator] = useState({
    leftIndex: -1,
    isLeftDisabled: true,
    pageIndex: 0,
    isMiddleDisabled: true,
    rightIndex: 1,
    isRightDisabled: true,
    totalChunks: 0
  });
  const [loadingMessage, updateLoadMessage] = useState(false);
  const urlText = useRef(null);

  /**
   * using the number totalchunks and the
   * newpaginators position, this function determines
   * which positions are disabled and enabled
   *
   * @param {*} totalChunks
   * @param {*} newPaginatorObject
   */
  const updatePageIndex = (totalChunks, newPaginatorObject) => {
    const newerPaginatorObject = {
      ...newPaginatorObject,
      totalChunks
    };

    // initial to paginator in the begining
    if (totalChunks < 0) {
      newerPaginatorObject.isLeftDisabled = true;
      newerPaginatorObject.isMiddleDisabled = true;
      newerPaginatorObject.isRightDisabled = true;
    } else if (totalChunks === 1) {
      newerPaginatorObject.isLeftDisabled = true;
      newerPaginatorObject.isMiddleDisabled = false;
      newerPaginatorObject.isRightDisabled = true;
    } else if (totalChunks >= 2) {
      newerPaginatorObject.isLeftDisabled = true;
      newerPaginatorObject.isMiddleDisabled = false;
      newerPaginatorObject.isRightDisabled = false;
    }

    // readjust to the indices if they have moved more than three spaces
    if (newerPaginatorObject.leftIndex <= -1) {
      newerPaginatorObject.isLeftDisabled = true;
    } else {
      newerPaginatorObject.isLeftDisabled = false;
    }

    if (newerPaginatorObject.rightIndex >= totalChunks) {
      newerPaginatorObject.isRightDisabled = true;
    } else {
      newerPaginatorObject.isRightDisabled = false;
    }

    updatePaginator(newerPaginatorObject);
  };

  /**
   * updates the application variables that need are
   * dependant on the server's response
   *
   * @return {*}
   */
  const updateAllWordApplicationVariables = (
    serverDataResponse,
    newPaginatorObject
  ) => {
    const newHistory = serverDataResponse.historyUrl.map((elem) => {
      return { urlId: elem.urlId, urlString: elem.urlString };
    });
    newHistory.unshift({ urlId: 0, urlString: 'Select a Url' });
    upatedWords(serverDataResponse.words);
    updateHistory(
      serverDataResponse.historyUrl.length < 1 ? historyUrl : newHistory
    );
    setSelectedUrl(serverDataResponse.currentSelectedUrl);
    updateErrorMessage(serverDataResponse.errorMessage);
    updatePageIndex(serverDataResponse.totalChunks, newPaginatorObject);
    updateLoadMessage(false);
  };

  /**
   *  does a post request with a formdata object
   *
   * @param {*} form
   */
  const urlRequest = (options, url, newPaginatorObject = {}) => {
    // if (options.method != "POST") options = {...options, headers:{
    //   'Content-Type': 'application/json'
    // }}
    const newUrl = serverUrl + url;
    fetch(newUrl, options)
      .then(
        (response) => response.json(),
        (error) => {
          updateErrorMessage(error.message);
        }
      )
      .then(
        (json) => {
          // update all variables
          updateAllWordApplicationVariables(json, newPaginatorObject);
          return json;
        },
        () => {
          updateErrorMessage('please type in a legit url');
          updateLoadMessage(false);
        }
      )
      .catch((error) => {
        updateErrorMessage(error.message);
        updateLoadMessage(false);
      });
  };
  const fetchPost = (body, PaginatorObject, url = '/') => {
    const options = {
      method: 'POST',
      body
    };
    urlRequest(options, url, PaginatorObject);
  };
  // form, newPaginatorObject, url;
  const fetchGet = (data, PaginatorObject, url = '/') => {
    const options = {
      method: 'GET',
      data
      // 'Content-Type': 'application/x-www-form-urlencoded'
      // 'Content-Type': 'application/application-json'
    };

    urlRequest(options, url, PaginatorObject);
  };

  const fetchUpdate = (data, PaginatorObject, url = '/') => {
    const options = {
      method: 'PUT',
      data
    };

    urlRequest(options, url, PaginatorObject);
  };

  const fetchDelete = (data, PaginatorObject, url = '/') => {
    const options = {
      method: 'DELETE',
      data
    };

    urlRequest(options, url, PaginatorObject);
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
    const { totalChunks } = paginatorObject;
    const newPaginatorObject = {
      leftIndex: -1,
      pageIndex: 0,
      rightIndex: 1,
      isLeftDisabled: true,
      isMiddleDisabled: true,
      isRightDisabled: true,
      totalChunks
    };

    // assure that the user places in a text before submiting
    let urlString = null;
    if (url || url.length > 0) {
      urlString = url;
    }
    form.append('urlText', urlString);
    updateLoadMessage(true);
    fetchPost(form, newPaginatorObject);
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
    const { totalChunks } = paginatorObject;
    const newPaginatorObject = {
      leftIndex: -1,
      pageIndex: 0,
      rightIndex: 1,
      isLeftDisabled: true,
      isMiddleDisabled: true,
      isRightDisabled: true,
      totalChunks
    };

    if (selectedValue === 'Select a Url') {
      return;
    }

    updateLoadMessage(true);
    setSelectedUrl(selectedValue);
    const foundUrlStringObj = historyUrl.filter((url) => {
      if (url.urlString === selectedValue) return true;
      return false;
    });
    const form = { selectedValue, pageIndex: 0 };
    const url = `/urlSelected/?selectedValue=${selectedValue}&urlId=${foundUrlStringObj[0].urlId}&pageIndex=0`;
    fetchGet(form, newPaginatorObject, url);
  };

  const updateCurrentUrlName = (e) => {
    // e.preventDefault()
    const newUrlName = e.target.value;
    setUpdateCurrentUrlName(newUrlName);
  };

  const updateUrl = () => {
    const { totalChunks } = paginatorObject;
    const newPaginatorObject = {
      leftIndex: -1,
      pageIndex: 0,
      rightIndex: 1,
      isLeftDisabled: true,
      isMiddleDisabled: true,
      isRightDisabled: true,
      totalChunks
    };

    if (currentUrlNameToUpdate.length < 1) {
      return;
    }
    updateLoadMessage(true);
    const url = `/?urlId=${currentSelectedUrl.urlId}&currentSelectedUrl=${currentUrlNameToUpdate}`;
    fetchUpdate('data', newPaginatorObject, url);
  };

  const deleteUrl = () => {
    const selectedValue = currentSelectedUrl.urlString;
    const { totalChunks } = paginatorObject;
    const newPaginatorObject = {
      leftIndex: -1,
      pageIndex: 0,
      rightIndex: 1,
      isLeftDisabled: true,
      isMiddleDisabled: true,
      isRightDisabled: true,
      totalChunks
    };

    if (selectedValue === 'Select a Url') {
      return;
    }
    updateLoadMessage(true);
    const urlId = historyUrl.find(
      (urlObj) => urlObj.urlString === selectedValue
    );
    const url = `/?urlId=${urlId.urlId}`;
    fetchDelete('data', newPaginatorObject, url);
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

  /**
   *  retrieve the initial data that may be stored on the server
   *
   * @return {*}
   */
  useEffect(() => {
    // delete initial data
    fetchGet({}, paginatorObject);
    // deleteUrl();
  }, []);

  /**
   * updates the paginiator's positions
   * and requests for more words according the
   * new positions
   *
   * @return {*}
   */
  const clickLeft = () => {
    const newPaginatorObject = {
      ...paginatorObject
    };

    if (newPaginatorObject.leftIndex <= -1) return;

    newPaginatorObject.leftIndex -= 1;
    newPaginatorObject.pageIndex -= 1;
    newPaginatorObject.rightIndex -= 1;

    // requestPageIndexData(newPaginatorObject);
    const url = `/urlSelected/?urlId=${currentSelectedUrl.urlId}&selectedValue=${currentSelectedUrl.urlString}&pageIndex=${newPaginatorObject.pageIndex}`;
    fetchGet({}, newPaginatorObject, url);
  };

  /**
   *   moves the paginators position by
   * index to the right and submits a data request
   * based on the new page index
   *
   * @return {*}
   */
  const clickRight = () => {
    const newPaginatorObject = {
      ...paginatorObject
    };
    if (newPaginatorObject.rightIndex >= newPaginatorObject.totalChunks) return;

    newPaginatorObject.leftIndex += 1;
    newPaginatorObject.pageIndex += 1;
    newPaginatorObject.rightIndex += 1;

    // requestPageIndexData(newPaginatorObject);
    const url = `/urlSelected/?urlId=${currentSelectedUrl.urlId}&selectedValue=${currentSelectedUrl.urlString}&pageIndex=${newPaginatorObject.pageIndex}`;
    fetchGet({}, newPaginatorObject, url);
  };

  /**
   * moves the paginator's position
   * to the beginning  of the pagination bar and
   * submits request of data based on the new
   * page index
   */
  const goToTheBegining = () => {
    const { totalChunks } = paginatorObject;
    const newPaginatorObject = {
      leftIndex: -1,
      pageIndex: 0,
      rightIndex: 1,
      isLeftDisabled: true,
      isMiddleDisabled: true,
      isRightDisabled: true,
      totalChunks
    };

    const url = `/urlSelected/?urlId=${currentSelectedUrl.urlId}&selectedValue=${currentSelectedUrl.urlString}&pageIndex=0`;
    fetchGet({}, newPaginatorObject, url);
    // requestPageIndexData(newPaginatorObject);
  };

  /**
   * moves the paginator's position
   * to the end of the pagination bar and
   * submits request of data based on the new
   * page index
   *
   */
  const goToTheEnd = () => {
    const { totalChunks } = paginatorObject;
    const newPaginatorObject = {
      leftIndex: paginatorObject.totalChunks - 2,
      pageIndex: paginatorObject.totalChunks - 1,
      rightIndex: paginatorObject.totalChunks,
      isLeftDisabled: true,
      isMiddleDisabled: true,
      isRightDisabled: true,
      totalChunks
    };

    // requestPageIndexData(newPaginatorObject);
    const url = `/urlSelected/?urlId=${currentSelectedUrl.urlId}&selectedValue=${currentSelectedUrl.urlString}&pageIndex=${newPaginatorObject.pageIndex}`;
    fetchGet({}, newPaginatorObject, url);
  };
  // helps prevent the user requesting multiple
  // click before receiving the servers data
  debounce(submit, 1200);

  return (
    <div className="mainContainer">
      <NateForm
        urlText={urlText}
        submit={submit}
        currentSelectedUrl={currentSelectedUrl.urlString}
        onChangeSelect={onChangeSelect}
        historyUrl={historyUrl}
        deleteUrl={deleteUrl}
        updateUrl={updateUrl}
        updateCurrentUrlName={updateCurrentUrlName}
      />
      <div id="errorMessage">{errorMessage}</div>

      <WordTable
        goToTheBegining={goToTheBegining}
        paginatorObject={paginatorObject}
        clickLeft={clickLeft}
        clickRight={clickRight}
        goToTheEnd={goToTheEnd}
        loadingMessage={loadingMessage}
        words={words}
      />

      <Paginator
        goToTheBegining={goToTheBegining}
        paginatorObject={paginatorObject}
        clickLeft={clickLeft}
        clickRight={clickRight}
        goToTheEnd={goToTheEnd}
      />
    </div>
  );
};

export default UrlForm;
