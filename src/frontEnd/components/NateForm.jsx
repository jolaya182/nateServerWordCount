/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/**
 * title: NateForm.js
 *
 * date: 3/22/2020
 *
 * author: javier olaya
 *
 * description: this file handles the form entry
 */

import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const NateForm = (props) => {
  const {
    urlText,
    submit,
    currentSelectedUrl,
    onChangeSelect,
    historyUrl
  } = props;
  return (
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
  );
};

export default NateForm;
