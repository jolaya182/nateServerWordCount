/* eslint-disable no-unused-vars */
/**
 * title: App.js
 *
 * date: 3/20/21
 *
 * author: javier olaya
 *
 * description: this component handles the basic routing for the webpage
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, HashRouter as Router } from 'react-router-dom';
import ErrorBoundary from './frontEnd/components/UtilComponents/ErrorBoundary';
import { Whoops404, Form } from './frontEnd/page';
import pages from './frontEnd/css/index.scss';

const App = () => (
  <ErrorBoundary>
    <Router>
      <Switch>
        <Route path="/" exact component={Form} />
        <Route component={Whoops404} />
      </Switch>
    </Router>
  </ErrorBoundary>
);

App.PropType = {
  myUtilComponent: PropTypes.elementType
};

export default App;
