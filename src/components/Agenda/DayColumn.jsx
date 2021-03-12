/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-one-expression-per-line */
/**
 * title: DayColumn.jsx
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this component handles the display of the all the grouped activities
 */
import React from 'react';
import PropTypes from 'prop-types';
import GroupedActivities from './GroupedActivities';
import HalfDay from './HalfDay';
import Hour from './Hour';

/**
 *displays all the grouped event activites in during the day
 *
 * @param {*} { groupedEventActivities, dayHours }
 * @returns component
 */
const DayColumn = ({ groupedEventActivities, dayHours }) => {
  const { am, pm } = dayHours;
  let areMorningEventsScheduled = dayHours;
  // are there events in the morning
  return (
    <div className="row">
      <div className="column">
        <HalfDay classN=" row half-day-pink">
          <div className="column">
            {areMorningEventsScheduled ? (
              <div className="">
                {(areMorningEventsScheduled = false)}
                {groupedEventActivities &&
                  groupedEventActivities.map((groupedActivity, indx) => {
                    return (
                      <GroupedActivities
                        groupedActivity={groupedActivity}
                        key={indx}
                      />
                    );
                  })}
              </div>
            ) : (
              (areMorningEventsScheduled = true)
            )}
            {am &&
              am.map((hour, indx) => {
                return indx < am.length - 1 ? (
                  <Hour classN="row hour" hour={false} key={indx} />
                ) : (
                  <Hour classN="row hour-no-line" hour={false} key={indx} />
                );
              })}
          </div>
        </HalfDay>
        <HalfDay classN="row half-day-blue">
          {areMorningEventsScheduled ? (
            <div className="">
              {(areMorningEventsScheduled = false)}
              {groupedEventActivities &&
                groupedEventActivities.map((groupedActivity, indx) => {
                  return (
                    <GroupedActivities
                      groupedActivity={groupedActivity}
                      key={indx}
                    />
                  );
                })}
            </div>
          ) : (
            (areMorningEventsScheduled = true)
          )}
          <div className="column">
            {pm &&
              pm.map((hour, indx) => {
                return <Hour classN="row hour" hour={false} key={indx} />;
              })}
          </div>
        </HalfDay>
      </div>
    </div>
  );
};

export default DayColumn;
DayColumn.propTypes = {
  groupedEventActivities: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object])
  ),
  dayHours: PropTypes.oneOfType([PropTypes.object])
};
DayColumn.defaultProps = {
  groupedEventActivities: null,
  dayHours: null
};
