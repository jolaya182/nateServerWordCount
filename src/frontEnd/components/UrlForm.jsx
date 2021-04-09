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
import React, { useState, useRef, useEffect, useReducer } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Row from 'react-bootstrap/Row';
import Paginator from './Paginator';
import NateForm from './NateForm';
import WordTable from './WordTable';
import appReducer from '../reducers/appReducer';
import StateContext from '../utils/contexts';
import serverUrl from './utilComponentData/constants';
import { stringBuilder } from '../utils/utlilFunctions';
import '../css/index.css';

/**
 *  form component used to get a word count from the url the
 *  user's url submission
 *
 * @return {Html element}
 */
const UrlForm = () => {
  const [state, dispatch] = useReducer(appReducer, {
    message: {},
    formObjectData: {
      words: [],
      paginatorObject: {
        leftIndex: -1,
        isLeftDisabled: true,
        pageIndex: 0,
        isMiddleDisabled: true,
        rightIndex: 1,
        isRightDisabled: true,
        totalChunks: 0
      },
      historyUrl: ['Select a Url'],
      currentSelectedUrl: {
        urlString: '',
        urlId: 0
      }
    }
  });

  const [currentUrlNameToUpdate, setUpdateCurrentUrlName] = useState('');
  const [errorMessage, updateErrorMessage] = useState('');
  const [loadingMessage, updateLoadMessage] = useState(false);
  const urlText = useRef(null);

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

  /**
   *
   *
   * @param {obj} body
   * @param {string} [url='/']
   * @return {obj}
   */
  const fetchPost = (body, url = '/') => {
    const options = {
      method: 'POST',
      body
    };
    return fetchRequest(options, url);
  };

  /**
   *
   *
   * @param {obj} data
   * @param {string} [url='/']
   * @return {obj}
   */
  const fetchGet = (data, url = '/') => {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    };

    return fetchRequest(options, url);
  };

  /**
   *
   *
   * @param {obj} data
   * @param {string} [url='/']
   * @return {obj}
   */
  const fetchUpdate = (data, url = '/') => {
    const options = {
      method: 'PUT',
      data
    };

    return fetchRequest(options, url);
  };

  /**
   *
   *
   * @param {obj} data
   * @param {string} [url='/']
   * @return {obj}
   */
  const fetchDelete = (data, url = '/') => {
    const options = {
      method: 'DELETE',
      data
    };

    return fetchRequest(options, url);
  };

  /**
   *  submits a url search from the input form
   *
   * @param {event} e
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
    dispatch({ type: 'RETRIEVE_FORM_OBJECT_DATA', serverDataResponse });
  };

  /**
   *  updates  the message and the fetches the word count
   *  based on the url selected
   *
   * @param {event} e
   */
  const onChangeSelect = async (e) => {
    e.preventDefault();
    const selectedValue = e.target.value;

    if (selectedValue === 'Select a Url') {
      return;
    }
    updateLoadMessage(true);
    const { historyUrl } = state.formObjectData;
    const foundUrlStringObj = historyUrl.find((url) => {
      if (url.urlString === selectedValue) return true;
      return false;
    });
    const variablesToBeEncoded = {
      selectedValue,
      urlId: foundUrlStringObj.urlId,
      pageIndex: 0
    };
    const url = stringBuilder(variablesToBeEncoded, '/urlSelected');
    const serverDataResponse = await fetchGet({}, url);
    dispatch({
      type: 'RETRIEVE_FORM_OBJECT_DATA',
      serverDataResponse
    });
  };

  /**
   * Gets all the urls
   *
   */
  const getInitialFormData = async () => {
    const serverDataResponse = await fetchGet();
    dispatch({ type: 'RETRIEVE_FORM_OBJECT_DATA', serverDataResponse });
  };

  /**
   * updates the currentSelected url
   *
   * @param {event} e
   */
  const updateCurrentUrlName = (e) => {
    const newUrlName = e.target.value;
    setUpdateCurrentUrlName(newUrlName);
  };

  /**
   * changes the name of the current url
   *
   */
  const updateUrl = async () => {
    if (currentUrlNameToUpdate.length < 1) {
      return;
    }
    const { currentSelectedUrl } = state.formObjectData;
    updateLoadMessage(true);
    const url = `/?urlId=${currentSelectedUrl.urlId}&currentSelectedUrl=${currentUrlNameToUpdate}`;
    const serverDataResponse = await fetchUpdate({}, url);

    dispatch({ type: 'RETRIEVE_FORM_OBJECT_DATA', serverDataResponse });
  };

  /**
   * Removes the url from the database
   *
   */
  const deleteUrl = async () => {
    const { currentSelectedUrl, historyUrl } = state.formObjectData;

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
    dispatch({ type: 'RETRIEVE_FORM_OBJECT_DATA', serverDataResponse });
  };

  /**
   *  retrieve the initial data that may be stored on the server
   *
   */
  useEffect(() => {
    // delete initial data
    getInitialFormData();
  }, []);

  /**
   * moves the paginator's position
   * to the beginning  of the pagination bar and
   * submits request of data based on the new
   * page index
   */
  const goToTheBegining = async () => {
    const { currentSelectedUrl, paginatorObject } = state.formObjectData;
    const variablesToBeEncoded = {
      urlId: currentSelectedUrl.urlId,
      selectedValue: currentSelectedUrl.urlString,
      pageIndex: 0
    };

    const url = stringBuilder(variablesToBeEncoded, '/urlSelected');
    const serverDataResponse = await fetchGet({}, url);

    dispatch({
      type: 'RETRIEVE_FORM_OBJECT_DATA',
      serverDataResponse,
      paginatorObject
    });
  };

  /**
   * updates the paginiator's positions
   * and requests for more words according the
   * new positions
   *
   */
  const clickLeft = async () => {
    const { paginatorObject, currentSelectedUrl } = state.formObjectData;

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

    dispatch({
      type: 'RETRIEVE_FORM_OBJECT_DATA',
      serverDataResponse,
      newPaginatorObject
    });
  };

  /**
   *   moves the paginators position by
   * index to the right and submits a data request
   * based on the new page index
   *
   */
  const clickRight = async () => {
    const { paginatorObject, currentSelectedUrl } = state.formObjectData;
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
    dispatch({
      type: 'RETRIEVE_FORM_OBJECT_DATA',
      serverDataResponse,
      newPaginatorObject
    });
  };

  /**
   * moves the paginator's position
   * to the end of the pagination bar and
   * submits request of data based on the new
   * page index
   *
   */
  const goToTheEnd = async () => {
    const { paginatorObject, currentSelectedUrl } = state.formObjectData;

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

    dispatch({
      type: 'RETRIEVE_FORM_OBJECT_DATA',
      serverDataResponse,
      newPaginatorObject
    });
  };

  return (
    <div className="mainContainer">
      <StateContext.Provider value={{ state, dispatch }}>
        <NateForm
          urlText={urlText}
          submit={submit}
          currentSelectedUrl={state.formObjectData.currentSelectedUrl.urlString}
          onChangeSelect={onChangeSelect}
          historyUrl={state.formObjectData.historyUrl}
          deleteUrl={deleteUrl}
          updateUrl={updateUrl}
          updateCurrentUrlName={updateCurrentUrlName}
        />
        <div id="errorMessage">{errorMessage}</div>
        <Row>
          <Paginator
            goToTheBegining={goToTheBegining}
            clickLeft={clickLeft}
            clickRight={clickRight}
            goToTheEnd={goToTheEnd}
            paginatorObject={state.formObjectData.paginatorObject}
            dispatch={dispatch}
            state={state}
          />
        </Row>
        <WordTable
          loadingMessage={loadingMessage}
          words={state.formObjectData.words}
        />
      </StateContext.Provider>
    </div>
  );
};

export default UrlForm;
