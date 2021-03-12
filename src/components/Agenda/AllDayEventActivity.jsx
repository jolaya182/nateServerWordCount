/* eslint-disable react/jsx-one-expression-per-line */
/**
 * title: AllDayEventActivity.jsx
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this component displays only the events that take up all day
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 *holds the properties of the all day event activity
 *
 * @param {*} { evnt }
 * @returns component
 */
const AllDayEventActivity = ({ evnt }) => {
  const { eventName, eventLocation } = evnt;
  return (
    <div
      className=" event-activity"
      style={{
        marginLeft: '160px'
      }}
    >
      <div className="event-activity-tab " />
      <div className="all-day-event-activity ">
        <div className=" event-activity-light-text">ALL DAY-</div>
        <h3 className="even-activity-name">{eventName}</h3>
        <div className=" event-activity-green">{eventLocation}</div>
      </div>
    </div>
  );
};

export default AllDayEventActivity;
AllDayEventActivity.propTypes = {
  evnt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  eventName: PropTypes.string,
  eventLocation: PropTypes.string
};
AllDayEventActivity.defaultProps = {
  evnt: null,
  eventName: null,
  eventLocation: null
};
