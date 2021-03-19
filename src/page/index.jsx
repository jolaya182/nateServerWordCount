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
import React, { useState, useRef } from 'react';
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

const UrlForm = () => {
  const [urls, submitForm] = useState([]);
  const urlString = useRef('');
  const textfile = useRef(true);

  const urlRequest = (url, file) => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file })
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((json) => {
        console.log('json', json);
        submitForm(json.data);
        return json;
      });
  };
  const submit = (e) => {
    // make the post request
    e.preventDefault();
    console.log('e', e);
    // some new obj
    // const
    // const urls = [];
    const newObj = { word: 'a', count: 2 };
    urls.push(newObj);
    console.log('urls', urls);
    urlRequest(`http://localhost:3000${urlString}`, textfile);

    // return urls;
  };

  return (
    <div>
      <form>
        <input type="text" placeholder="type your url " ref={urlString} />
        <input type="file" ref={textfile} />
        <button type="button" onClick={submit}>
          submit
        </button>
        <section>{urls.map((url) => `${url.word} ${url.count}`)}</section>
      </form>
    </div>
  );
};

export const Form = () => <UrlForm />;
