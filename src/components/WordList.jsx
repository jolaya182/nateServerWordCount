/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/**
 * title: WordList.js
 *
 * date: 3/22/2020
 *
 * author: javier olaya
 *
 * description: this component display all the words
 * fetched as a rows
 */
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.css';

const WordList = (props) => {
  const { words } = props;
  return words.map((word, index) => {
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
  });
};

export default WordList;
