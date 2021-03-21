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
  const urlText = useRef(null);
  // const textfile = useRef(null);

  const urlRequest = (url, fort) => {
    // const form = Array.from(fort.entries());
    // console.log('form', form);
    const options = {
      method: 'GET',
      // headers: { 'Content-Type': 'application/json' },
      data: fort
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
    // console.log('urlString.current', urlString.current.value);
    // console.log('textfile.current', textfile.current.files);
    const form = new FormData();
    // const input = textfile.current.files[0];
    const url = urlText.current.value;
    // form.append('file', input); // textfile
    form.append('urlText', url);
    urlRequest(`http://localhost:3000`, form);
  };

  return (
    <div>
      <form id="nateForm" encType="multipart/form-data">
        <input type="text" placeholder="type your url" ref={urlText} />
        {/* <input
          type="file"
          accept=".txt,.text,"
          ref={textfile}
          name="file"
          id="avatar"
        /> */}
        <button type="button" onClick={submit}>
          submit
        </button>
        <section>{urls.map((url) => `${url.word} ${url.count}`)}</section>
      </form>
    </div>
  );
};

export const Form = () => <UrlForm />;
