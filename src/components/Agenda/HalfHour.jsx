/* eslint-disable react/jsx-one-expression-per-line */
/**
 * title: HalfHour.jsx
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this component displays either :00, :30 or no time
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 *displays the number of the half hour on the time column
 *
 * @param {*} { time }
 * @returns component
 */
const HalfHour = ({ time }) => <div className="row ">{time}</div>;

export default HalfHour;
HalfHour.propTypes = {
  time: PropTypes.string
};
HalfHour.defaultProps = {
  time: PropTypes.string
};
