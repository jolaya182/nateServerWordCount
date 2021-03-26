/* eslint-disable react/prop-types */
/**
 * title: index.jsx
 *
 * date: 3/20/2020
 *
 * author: javier olaya
 *
 * description: this component handles the form that collects the url and a text for a word count
 */

import React from 'react';
import UrlForm from '../components/UrlForm';

export const Whoops404 = ({ location }) => (
  <div className="whoops404">
    <h1>
      resources not found at
      {` ${location.pathname}`}
    </h1>
  </div>
);

export const Form = () => <UrlForm />;
