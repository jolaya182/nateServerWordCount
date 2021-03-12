/* eslint-disable react/prop-types */
/**
 * title: index.jsx
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this component handles all the pages to render on the webpage
 */
// main page component create the 404 page and the all other
// pages as exported components
import React from 'react';
import MainMenu from './MainMenu';
import Agenda from '../components/Agenda/Agenda';

// bring what ever component to render
import SomeArticle from '../components/UtilComponents/SomeArticle';
import MiddleBody from './MiddleBody';
import Footer from './Footer';

export const Whoops404 = ({ location }) => (
  <div className="whoops404">
    <h1>
      resources not found at
      {` ${location.pathname}`}
    </h1>
  </div>
);

export const PageTemplate = ({ children }) => (
  <div className="page">
    <MainMenu />
    {children}
  </div>
);

export const myAgendaComponent = () => (
  <div className="rightBody">
    <Agenda />
  </div>
);

export const myUtilComponent = () => (
  <PageTemplate>
    <div className="rightBody">
      <MiddleBody />
      <Footer />
    </div>
  </PageTemplate>
);

export const articleHtml = () => <SomeArticle />;
