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

const serverUrl = `http://localhost:3000`;

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
  const [words, submitForm] = useState([]);
  const [historyUrl, updateHistory] = useState([]);
  const [currentSelectedUrl, setSelectedUrl] = useState('');
  const urlText = useRef(null);
  const [loading, updateLoadMessage] = useState(false);
  // const textfile = useRef(null);

  const urlRequest = (form) => {
    // const form = Array.from(fort.entries());
    // console.log('form', form);
    const options = {
      method: 'POST',
      // headers: { 'Content-Type': 'application/json' },
      body: form
    };

    fetch(serverUrl, options)
      .then((response) => response.json())
      .then((json) => {
        console.log('json', json);
        submitForm(json.data);
        console.log('(json.historyUrl', json.historyUrl);
        updateHistory(json.historyUrl);
        updateLoadMessage(false);
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
    const selectedUrl = currentSelectedUrl;
    // form.append('file', input); // textfile
    let urlString = null;
    if (url || url.length > 0) {
      urlString = url;
    }
    console.log('urlText', urlString.length);
    form.append('urlText', urlString);
    form.append('selectedUrl', selectedUrl);
    updateLoadMessage(true);
    urlRequest(form);
  };

  const onChangeSelect = (e) => {
    e.preventDefault();
    const selectedValue = e.target.value;
    const urlString = urlText.current.value;
    const selectedUrl = currentSelectedUrl;
    const form = new FormData();
    form.append('urlText', urlString);
    form.append('selectedUrl', selectedUrl);
    console.log('selected', selectedValue);
    setSelectedUrl(selectedValue);
    updateLoadMessage(true);
    urlRequest(form);
  };

  // function that avoids triggering other functions to quickly
  const debounce = (func, delay) => {
    let timeout;
    return function funExecuted(...args) {
      const later = () => {
        timeout = null;
        func(...args);
      };
      // reset the clock after every click
      clearTimeout(timeout);
      timeout = setTimeout(later, delay);
    };
  };
  debounce(submit, 1200);
  // debounce(onChangeSelect, 1200);

  return (
    <div>
      <form id="nateForm" encType="multipart/form-data">
        <input type="text" placeholder="type your url" ref={urlText} />
        <button type="button" onClick={submit}>
          submit
        </button>
        <select
          // ref={selectedOption}
          value={currentSelectedUrl}
          onChange={onChangeSelect}
        >
          {historyUrl.map((url, index) => (
            <option value={url} key={`nate-select-${index}`}>
              {url}
            </option>
          ))}
        </select>
      </form>
      {loading ? (
        `loading...`
      ) : (
        <section>
          {words.map((word, index) => {
            return (
              <div key={`nate-words${index}`}>
                <div>{`${word.word}: ${word.count}`}</div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
};

export const Form = () => <UrlForm />;
