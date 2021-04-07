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
import Row from 'react-bootstrap/Row';
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
  const updatePageIndex = (
    totalChunks,
    newPaginatorObject = { leftIndex: -1, pageIndex: 0, rightIndex: 1 }
  ) => {
    const newerPaginatorObject = {
      ...newPaginatorObject,
      isLeftDisabled: true,
      isMiddleDisabled: true,
      isRightDisabled: true,
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
  const displayServerResponse = (serverDataResponse) => {
    updateLoadMessage(false);
    updateErrorMessage(serverDataResponse.errorMessage);
  };

  /**
   *  does a post request with a formdata object
   *
   * @param {*} form
   */
  const fetchRequest = (options, url) => {
    const newUrl = serverUrl + url;
    return fetch(newUrl, options)
      .then(
        (response) => response.json(),
        (error) => {
          updateErrorMessage(error.message);
        }
      )
      .then(
        (json) => {
          // update all variables
          displayServerResponse(json);
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

  const fetchPost = (body, url = '/') => {
    const options = {
      method: 'POST',
      body
    };
    return fetchRequest(options, url);
  };

  const fetchGet = (data, url = '/') => {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    };

    return fetchRequest(options, url);
  };

  const fetchUpdate = (data, url = '/') => {
    const options = {
      method: 'PUT',
      data
    };

    return fetchRequest(options, url);
  };

  const fetchDelete = (data, url = '/') => {
    const options = {
      method: 'DELETE',
      data
    };

    return fetchRequest(options, url);
  };

  const stringBuilder = (objectToEncode, url) => {
    const esc = encodeURIComponent;
    const encodedString = Object.keys(objectToEncode)
      .map((key) => {
        return `${key}=${esc(objectToEncode[key])}`;
      })
      .join('&');
    return `${url}/?${encodedString}`;
  };

  const updateForm = (serverDataResponse, newPaginatorObject) => {
    // no destructure due initial state name conflicts
    const newHistory = serverDataResponse.historyUrl.map((elem) => {
      return { urlId: elem.urlId, urlString: elem.urlString };
    });

    newHistory.unshift({ urlId: 0, urlString: 'Select a Url' });
    updateHistory(
      serverDataResponse.historyUrl.length < 1 ? historyUrl : newHistory
    );
    upatedWords(serverDataResponse.words);
    setSelectedUrl(serverDataResponse.currentSelectedUrl);
    updatePageIndex(serverDataResponse.totalChunks, newPaginatorObject);
  };

  /**
   *  submits a url search from the input form
   *
   * @param {*} e
   */
  const submit = async (e) => {
    // make the post request
    e.preventDefault();
    const form = new FormData();
    const url = urlText.current.value;

    // assure that the user places in a text before submiting
    let urlString = null;
    if (url || url.length > 0) {
      urlString = url;
    }
    form.append('urlText', urlString);
    updateLoadMessage(true);
    const serverDataResponse = await fetchPost(form);

    updateForm(serverDataResponse);
  };

  /**
   *  updates  the message and the fetches the word count
   *  based on the url selected
   *
   * @param {*} e
   */
  const onChangeSelect = async (e) => {
    e.preventDefault();
    const selectedValue = e.target.value;

    if (selectedValue === 'Select a Url') {
      return;
    }
    updateLoadMessage(true);
    const foundUrlStringObj = historyUrl.find((url) => {
      if (url.urlString === selectedValue) return true;
      return false;
    });
    const variablesToBeEncoded = {
      selectedValue,
      urlId: foundUrlStringObj.urlId,
      pageIndex: 0
    };
    // const url = `/urlSelected/?selectedValue=${selectedValue}&urlId=${foundUrlStringObj.urlId}&pageIndex=0`;
    const url = stringBuilder(variablesToBeEncoded, '/urlSelected');
    const serverDataResponse = await fetchGet({}, url);

    updateForm(serverDataResponse);
  };

  const getInitialFormData = async () => {
    const serverDataResponse = await fetchGet();
    updateForm(serverDataResponse);
  };

  const updateCurrentUrlName = (e) => {
    const newUrlName = e.target.value;
    setUpdateCurrentUrlName(newUrlName);
  };

  const updateUrl = async () => {
    const newPaginatorObject = {
      leftIndex: -1,
      pageIndex: 0,
      rightIndex: 1
    };

    if (currentUrlNameToUpdate.length < 1) {
      return;
    }
    updateLoadMessage(true);
    const url = `/?urlId=${currentSelectedUrl.urlId}&currentSelectedUrl=${currentUrlNameToUpdate}`;
    const serverDataResponse = await fetchUpdate({}, url);

    updateForm(serverDataResponse, newPaginatorObject);
  };

  const deleteUrl = async () => {
    const selectedValue = currentSelectedUrl.urlString;
    if (selectedValue === 'Select a Url') {
      return;
    }
    updateLoadMessage(true);
    const urlId = historyUrl.find(
      (urlObj) => urlObj.urlString === selectedValue
    );
    const url = `/?urlId=${urlId.urlId}`;
    const serverDataResponse = await fetchDelete('data', url);
    updateForm(serverDataResponse);
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
    getInitialFormData();
  }, []);

  /**
   * updates the paginiator's positions
   * and requests for more words according the
   * new positions
   *
   * @return {*}
   */
  const clickLeft = async () => {
    if (paginatorObject.leftIndex <= -1) return;

    const newPaginatorObject = {
      leftIndex: paginatorObject.leftIndex - 1,
      pageIndex: paginatorObject.pageIndex - 1,
      rightIndex: paginatorObject.rightIndex - 1
    };

    const variablesToBeEncoded = {
      urlId: currentSelectedUrl.urlId,
      selectedValue: currentSelectedUrl.urlString,
      pageIndex: newPaginatorObject.pageIndex
    };

    const url = stringBuilder(variablesToBeEncoded, '/urlSelected');
    const serverDataResponse = await fetchGet({}, url);

    updateForm(serverDataResponse, newPaginatorObject);
  };

  /**
   *   moves the paginators position by
   * index to the right and submits a data request
   * based on the new page index
   *
   * @return {*}
   */
  const clickRight = async () => {
    if (paginatorObject.rightIndex >= paginatorObject.totalChunks) return;

    const newPaginatorObject = {
      leftIndex: paginatorObject.leftIndex + 1,
      pageIndex: paginatorObject.pageIndex + 1,
      rightIndex: paginatorObject.rightIndex + 1
    };

    const variablesToBeEncoded = {
      urlId: currentSelectedUrl.urlId,
      selectedValue: currentSelectedUrl.urlString,
      pageIndex: newPaginatorObject.pageIndex
    };

    const url = stringBuilder(variablesToBeEncoded, '/urlSelected');
    const serverDataResponse = await fetchGet({}, url);

    updateForm(serverDataResponse, newPaginatorObject);
  };

  /**
   * moves the paginator's position
   * to the beginning  of the pagination bar and
   * submits request of data based on the new
   * page index
   */
  const goToTheBegining = async () => {
    const newPaginatorObject = {
      leftIndex: -1,
      pageIndex: 0,
      rightIndex: 1
    };

    const variablesToBeEncoded = {
      urlId: currentSelectedUrl.urlId,
      selectedValue: currentSelectedUrl.urlString,
      pageIndex: 0
    };

    const url = stringBuilder(variablesToBeEncoded, '/urlSelected');
    const serverDataResponse = await fetchGet({}, url);

    updateForm(serverDataResponse, newPaginatorObject);
  };

  /**
   * moves the paginator's position
   * to the end of the pagination bar and
   * submits request of data based on the new
   * page index
   *
   */
  const goToTheEnd = async () => {
    const newPaginatorObject = {
      leftIndex: paginatorObject.totalChunks - 2,
      pageIndex: paginatorObject.totalChunks - 1,
      rightIndex: paginatorObject.totalChunks
    };

    const variablesToBeEncoded = {
      urlId: currentSelectedUrl.urlId,
      selectedValue: currentSelectedUrl.urlString,
      pageIndex: newPaginatorObject.pageIndex
    };

    const url = stringBuilder(variablesToBeEncoded, '/urlSelected');
    const serverDataResponse = await fetchGet({}, url);

    updateForm(serverDataResponse, newPaginatorObject);
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
      <Row>
        <Paginator
          goToTheBegining={goToTheBegining}
          paginatorObject={paginatorObject}
          clickLeft={clickLeft}
          clickRight={clickRight}
          goToTheEnd={goToTheEnd}
        />
      </Row>
      <WordTable loadingMessage={loadingMessage} words={words} />
    </div>
  );
};

export default UrlForm;
