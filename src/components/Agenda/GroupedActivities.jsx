/* eslint-disable react/jsx-one-expression-per-line */
/**
 * title: GroupedActivities.jsx
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this component handles the all grouped activities
 */
import React from 'react';
import PropTypes from 'prop-types';
import EventActivity from './EventActivity';

/**
 * holds either an event activity or serveral event activities
 *
 * @param {*} { groupedActivity }
 * @returns component
 */
const GroupedActivities = ({ groupedActivity }) => {
  const {
    eventActivityCollection,
    numberOfGroupedActivities
  } = groupedActivity;
  const { data } = eventActivityCollection;
  return (
    <div>
      <div
        className="grouped-activity"
        style={{
          display: 'flex'
        }}
      >
        {data &&
          data.map(evnt => {
            return (
              <div
                className="event-activity-wraper"
                key={evnt.eventId}
                style={{
                  width: `${100 / numberOfGroupedActivities}%`,
                  height: '0px'
                }}
              >
                <EventActivity evnt={evnt} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GroupedActivities;
GroupedActivities.propTypes = {
  groupedActivity: PropTypes.oneOfType([PropTypes.object]),
  data: PropTypes.oneOfType([PropTypes.element]),
  eventActivityCollection: PropTypes.oneOfType([PropTypes.element]),
  numberOfGroupedActivities: PropTypes.oneOfType([PropTypes.element])
};
GroupedActivities.defaultProps = {
  groupedActivity: null,
  data: null,
  eventActivityCollection: null,
  numberOfGroupedActivities: null
};
