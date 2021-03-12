/* eslint-disable react/jsx-one-expression-per-line */
/**
 * title: HalfDay.jsx
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this component displays either a am time block or pm time block
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * displays either the first half or the second half of the day or both
 *
 * @param {*} props
 * @returns component
 */
const HalfDay = ({ children, classN }) => {
  return <div className={classN}>{children}</div>;
};

export default HalfDay;
HalfDay.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.bool]))
  ]),
  classN: PropTypes.string
};
HalfDay.defaultProps = {
  children: null,
  classN: null
};
