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
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import { ListGroup } from 'react-bootstrap';
import Paginator from './Paginator';
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
  const [currentSelectedUrl, setSelectedUrl] = useState('');
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
   *  does a post request with a formdata object
   *
   * @param {*} form
   */
  const urlRequest = (form, newPaginatorObject = {}) => {
    const options = {
      method: 'POST',
      body: form
    };

    fetch(serverUrl, options)
      .then(
        (response) => response.json(),
        (error) => {
          updateErrorMessage(error.message);
        }
      )
      .then(
        (json) => {
          json.data.shift();
          upatedWords(json.data);
          updateHistory(json.historyUrl);
          setSelectedUrl(json.currentSelectedUrl);
          updateLoadMessage(false);
          updateErrorMessage('');
          updatePageIndex(json.totalChunks, newPaginatorObject);
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
   *  organizes the form it will be submitting
   *  with a new index page number
   * @param {*} newPaginatorObject
   */
  const requestPageIndexData = (newPaginatorObject) => {
    const form = new FormData();
    form.append('urlText', null);
    form.append('selectedUrl', currentSelectedUrl);
    form.append('pageIndex', newPaginatorObject.pageIndex);
    updateLoadMessage(true);
    urlRequest(form, newPaginatorObject);
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
    form.append('selectedUrl', selectedUrl);
    form.append('pageIndex', 0);
    updateLoadMessage(true);
    urlRequest(form, newPaginatorObject);
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

    console.log('selectedValue', selectedValue);
    if (selectedValue === 'Select a Url') {
      console.log('should return');
      return;
    }
    const form = new FormData();
    form.append('urlText', null);
    form.append('selectedUrl', selectedValue);
    form.append('pageIndex', 0);
    updateLoadMessage(true);
    urlRequest(form, newPaginatorObject);
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
    const form = new FormData();
    form.append('fetchUrls', true);
    urlRequest(form, paginatorObject);
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

    requestPageIndexData(newPaginatorObject);
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

    requestPageIndexData(newPaginatorObject);
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

    requestPageIndexData(newPaginatorObject);
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

    requestPageIndexData(newPaginatorObject);
  };
  // helps prevent the user requesting multiple
  // click before receiving the servers data
  debounce(submit, 1200);

  return (
    <div className="mainContainer">
      <Form.Group id="nateForm" encType="multipart/form-data">
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="type your url"
              ref={urlText}
              id="urlInput"
            />
          </Col>
          <Col>
            <Button type="button" onClick={submit} id="submit">
              submit
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="center">
            <Form.Control
              as="select"
              value={currentSelectedUrl}
              onChange={onChangeSelect}
            >
              {historyUrl.map((url, index) => (
                <option value={url} key={`nate-select-${index}`}>
                  {url}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Row>
      </Form.Group>
      <div id="errorMessage">{errorMessage}</div>
      <ListGroup>
        <Row>
          <Paginator
            goToTheBegining={goToTheBegining}
            paginatorObject={paginatorObject}
            clickLeft={clickLeft}
            clickRight={clickRight}
            goToTheEnd={goToTheEnd}
          />
        </Row>
        <ListGroup.Item variant="primary">
          {loadingMessage ? (
            <Row>
              <Col className="center">Loading Word Count...</Col>
            </Row>
          ) : (
            <Row>
              <Col className="center">Word</Col>
              <Col className="center">Count</Col>
            </Row>
          )}
        </ListGroup.Item>

        {words.map((word, index) => {
          return (
            <ListGroup.Item key={`nate-words${index}`} variant="primary">
              <Row>
                <Col>
                  <ListGroup.Item className="center">{`${word.word}`}</ListGroup.Item>
                </Col>
                <Col>
                  <ListGroup.Item className="center">{`${word.count}`}</ListGroup.Item>
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>

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
