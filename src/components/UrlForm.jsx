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
          <Col className="center">Select Url History</Col>
          <Col>
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
      {loadingMessage ? (
        `Loading Word Count...`
      ) : (
        <ListGroup>
          <Row>
            <Col className="center">Word</Col>
            <Col className="center">Count</Col>
          </Row>
          {words.map((word, index) => {
            return (
              <ListGroup.Item key={`nate-words${index}`} variant="primary">
                <Row>
                  <Col>
                    <ListGroup.Item className="center">{`${word.word}:`}</ListGroup.Item>
                  </Col>
                  <Col>
                    <ListGroup.Item className="center">{`${word.count}`}</ListGroup.Item>
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
      <Row>
        <Col>
          <div className="pagination1">
            <Pagination>
              <Pagination.First />
              <Pagination.Prev />
              <Pagination.Item>1</Pagination.Item>
              <Pagination.Ellipsis />
              <Pagination.Item active> 2</Pagination.Item>
              <Pagination.Ellipsis />
              <Pagination.Item>3</Pagination.Item>
              <Pagination.Next />
              <Pagination.Last />
            </Pagination>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UrlForm;
