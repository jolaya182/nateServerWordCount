/* eslint-disable react/jsx-one-expression-per-line */
/**
 * title: Panel.jsx
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this component holds the two columns that display the time and the events on that day
 */
import React from 'react';
import PropTypes from 'prop-types';
import TimeColumn from './TimeColumn';
import DayColumn from './DayColumn';

/**
 *holds both the time and the all the day activites
 *
 * @param {*} { groupedEventActivities, dayHours }
 * @returns
 */
const Panel = ({ groupedEventActivities, dayHours }) => {
  return (
    <div className="row">
      <div className="time-column-wrapper">
        <TimeColumn dayHours={dayHours} />
      </div>
      <div className="day-column-wrapper">
        <DayColumn
          dayHours={dayHours}
          groupedEventActivities={groupedEventActivities}
        />
      </div>
    </div>
  );
};

export default Panel;
Panel.propTypes = {
  groupedEventActivities: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object])
  ),
  dayHours: PropTypes.oneOfType([PropTypes.object])
};
Panel.defaultProps = { groupedEventActivities: null, dayHours: null };
