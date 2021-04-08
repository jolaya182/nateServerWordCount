/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/**
 * title: Paginator.js
 *
 * date: 3/22/2020
 *
 * author: javier olaya
 *
 * description: this file handles all the form submission and words rendering
 */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-bootstrap/Pagination';

import '../css/index.css';

const Paginator = ({
  goToTheBegining,
  clickLeft,
  clickRight,
  goToTheEnd,
  paginatorObject
}) => {
  const toTheBegining = () => {
    goToTheBegining();
  };
  const toTheEnd = () => {
    goToTheEnd();
  };
  const clickR = () => {
    clickRight();
  };
  const clickL = () => {
    clickLeft();
  };

  return (
    <Row>
      <Col>
        <div className="pagination1">
          <Pagination>
            <Pagination.First
              onClick={toTheBegining}
              disabled={paginatorObject.isLeftDisabled}
            />

            {paginatorObject.isLeftDisabled ? (
              ''
            ) : (
              <Pagination.Item
                onClick={clickL}
                disabled={paginatorObject.isLeftDisabled}
              >
                {paginatorObject.leftIndex + 1}
              </Pagination.Item>
            )}

            {paginatorObject.isMiddleDisabled ? (
              ''
            ) : (
              <Pagination.Item
                disabled={paginatorObject.isMiddleDisabled}
                active
              >
                {paginatorObject.pageIndex + 1}
              </Pagination.Item>
            )}

            {paginatorObject.isRightDisabled ? (
              ''
            ) : (
              <Pagination.Item
                onClick={clickR}
                disabled={paginatorObject.isRightDisabled}
              >
                {paginatorObject.rightIndex + 1}
              </Pagination.Item>
            )}

            <Pagination.Last
              onClick={toTheEnd}
              disabled={paginatorObject.isRightDisabled}
            />
          </Pagination>
        </div>
      </Col>
    </Row>
  );
};

export default Paginator;
