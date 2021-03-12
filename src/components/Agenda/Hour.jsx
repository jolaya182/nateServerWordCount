/* eslint-disable react/jsx-one-expression-per-line */
/**
 * title: Hour.jsx
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this component displays the regular hour on the TimeColumn component
 */
import React from 'react';
import PropTypes from 'prop-types';
import HalfHour from './HalfHour';

/**
 * displays the number of the hour on the time column
 *
 * @param {*} { hour, classN }
 * @returns component
 */
const Hour = ({ hour, classN }) => {
  const thehour = hour || '';
  const Zerominutes = hour ? ':00' : '';
  const thirtyMinutes = hour ? ':30' : '';
  return (
    <div className="">
      <div className={classN}>
        <div className=" ">{`${thehour}${Zerominutes}`}</div>
        <div className="column hour-height">
          <div className="row half-Hour">
            <div />
          </div>
          <div className="row ">
            <HalfHour time={`${thehour}${thirtyMinutes}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hour;
Hour.propTypes = {
  hour: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ]),
  classN: PropTypes.string
};
Hour.defaultProps = {
  hour: null,
  classN: null
};
