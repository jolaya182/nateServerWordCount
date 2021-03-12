/* eslint-disable import/no-named-as-default */
/* eslint-disable react/jsx-one-expression-per-line */
/**
 * title: Agenda.jsx
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this component handles the Agenda and event schedule aspect of the webpage
 */
import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Panel from './Panel';
import {
  ServerRequestFailureMitigationPlan,
  fetchExecuteCallbackFunction,
  areFetchRequestResponsePropertyNamesValid
} from '../../util/ApplicationUtil';
import AllDayEventActivity from './AllDayEventActivity';
import { AgendaConstants, agendaUrl } from './constants/AgendaConstants';

/**
 * class that handles all the fron end logic of the agenda application
 *
 * @groupedActivitiesModelCollection array
 * @allDayEvents array
 * @startTime int
 * @endTime int
 *
 * @export
 * @class Agenda
 * @extends {React.Component}
 */
export default class Agenda extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupedActivitiesModelCollection: [],
      allDayEvents: [],
      endTime: 20,
      startTime: 9
    };
  }

  /**
   *makes eventactivities fetch request to initialize the agenda application
   *
   * @memberof Agenda
   */
  componentDidMount() {
    const { startTime, endTime } = this.state;
    this.fetchAllEvents(this.populateState, { startTime, endTime });
  }

  ServerRequestFailureMitigationPlanInovacation = () => {
    this.setState(ServerRequestFailureMitigationPlan(AgendaConstants));
  };

  /**
   * update the state with the returned fetch request
   *
   * @memberof Agenda
   */
  populateState = incomingGroupedEventActivities => {
    areFetchRequestResponsePropertyNamesValid(
      this.state,
      incomingGroupedEventActivities
    );
    this.setState(incomingGroupedEventActivities);
  };

  /**
   *callback function for fetching all event activities
   *
   * @memberof Agenda
   * @returns integer
   */
  fetchAllEvents = (callBackFunction, data) => {
    this.fetchWithCallbackFunction(agendaUrl, 'POST', callBackFunction, data);
  };

  /**
   *dynamic function fetch request for all types of different callback functions
   *
   * @memberof Agenda
   */
  fetchWithCallbackFunction = (url, method, callBackFunction, data) => {
    fetchExecuteCallbackFunction(url, method, callBackFunction, data).then(
      error => {
        if (error) {
          console.error('error found', error);
          this.ServerRequestFailureMitigationPlanInovacation(AgendaConstants);
        }
      }
    );
    // catch should be here with the server mitagation plan
  };

  /**
   *returns an array of all hours from start to end time
   *
   * @memberof Agenda
   * @returns array
   */
  printAllHours = () => {
    const { startTime, endTime } = this.state;
    const day = { am: [], pm: [], areMorningEventsScheduled: false };
    for (let indx = startTime; indx < endTime; indx += 1) {
      // eslint-disable-next-line no-unused-expressions
      indx < 12 ? day.am.push(indx) : day.pm.push(this.converToTime(indx));
    }
    day.areMorningEventsScheduled = day.am.length > 0;
    return day;
  };

  /**
   *returns the time coversion from military time to regular time
   *
   * @memberof Agenda
   * @returns integer
   */
  converToTime = time => {
    return time - 11;
  };

  render() {
    const { groupedActivitiesModelCollection, allDayEvents } = this.state;
    const { printAllHours } = this;
    return (
      <div className="middle-wrapper">
        <div className="column">
          <Header />
          {allDayEvents.map((evnt, indx) => (
            <div className="row all-day-padding" key={indx}>
              <AllDayEventActivity evnt={evnt} />
            </div>
          ))}
          <Panel
            groupedEventActivities={groupedActivitiesModelCollection}
            dayHours={printAllHours()}
          />
        </div>
      </div>
    );
  }
}

Agenda.propTypes = {
  Header: PropTypes.element,
  Panel: PropTypes.element,
  AllDayEventActivity: PropTypes.element
};

Agenda.defaultProps = {
  Header: null,
  Panel: null,
  AllDayEventActivity: null
};
