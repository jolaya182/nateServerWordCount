/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/**
 * title: WordTable.js
 *
 * date: 3/22/2020
 *
 * author: javier olaya
 *
 * description: this component display the title and
 * fetch status
 */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ListGroup } from 'react-bootstrap';
import WordList from './WordList';

const WordTable = (props) => {
  const { loadingMessage, words } = props;
  return (
    <ListGroup>
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
      <WordList words={words} />
    </ListGroup>
  );
};

export default WordTable;
