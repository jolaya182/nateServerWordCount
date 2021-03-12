/* eslint-disable react/jsx-one-expression-per-line */
/**
 * title: TimeColumn.jsx
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this component handles the display the start time and end time of the day
 */
import React from 'react';

import PropTypes from 'prop-types';
import Hour from './Hour';
import HalfDay from './HalfDay';

/**
 * displays all the hours in the agenda
 *
 * @param {*} { dayHours }
 * @returns component
 */
const TimeColumn = ({ dayHours }) => {
  const { am, pm } = dayHours;

  return (
    <div className="row">
      <div className="column time-column">
        <HalfDay classN=" row half-day-pink">
          <div>
            <h1 className=" half-day-margin-pink">AM</h1>
          </div>
          <div className="column">
            {am &&
              am.map((hour, indx) => {
                return indx < am.length - 1 ? (
                  <Hour classN="row hour" hour={hour} key={indx} />
                ) : (
                  <Hour classN="row hour-no-line" hour={hour} key={indx} />
                );
              })}
          </div>
        </HalfDay>
        <HalfDay classN="row half-day-blue">
          <div>
            <h1 className=" halfDayMarginBlue">PM</h1>
          </div>
          <div className="column">
            {pm &&
              pm.map((hour, indx) => {
                return <Hour classN="row hour" hour={hour} key={indx} />;
              })}
          </div>
        </HalfDay>
      </div>
    </div>
  );
};

export default TimeColumn;
TimeColumn.propTypes = { dayHours: PropTypes.oneOfType([PropTypes.object]) };
TimeColumn.defaultProps = {
  dayHours: null
};
