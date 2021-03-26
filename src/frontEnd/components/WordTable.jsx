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
import Paginator from './Paginator';
import WordList from './WordList';

const WordTable = (props) => {
  const {
    goToTheBegining,
    paginatorObject,
    clickLeft,
    clickRight,
    goToTheEnd,
    loadingMessage,
    words
  } = props;
  return (
    <ListGroup>
      <Row>
        <Paginator
          goToTheBegining={goToTheBegining}
          paginatorObject={paginatorObject}
          clickLeft={clickLeft}
          clickRight={clickRight}
          goToTheEnd={goToTheEnd}
          words={words}
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
      <WordList words={words} />
    </ListGroup>
  );
};

export default WordTable;
