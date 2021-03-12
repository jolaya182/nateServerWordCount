/* eslint-disable react/jsx-one-expression-per-line */
/**
 * title: EventActivity.jsx
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this component handles the display of an event
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * contains all the properties of the event activity
 *
 * @param {*} { evnt }
 * @returns component
 */
const EventActivity = ({ evnt }) => {
  const {
    regulartime,
    eventName,
    eventLocation,
    topPosition,
    eventHeight
  } = evnt;
  return (
    <div
      className=" event-activity"
      style={{
        top: topPosition,
        height: eventHeight
      }}
    >
      <div className="event-activity-tab " />
      <div className="event-activity-wrap ">
        <div className=" event-activity-light-text">{regulartime}</div>
        <h3 className="even-activity-name">{eventName}</h3>
        <div className=" event-activity-green">{eventLocation}</div>
      </div>
    </div>
  );
};

export default EventActivity;
EventActivity.propTypes = {
  evnt: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string
    ])
  )
};
EventActivity.defaultProps = {
  evnt: null
};
