/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-unused-vars */
/**
 * title: Form.js
 *
 * date: / /
 *
 * author: javier olaya
 *
 * description: component to hold the picture
 */

import React from 'react';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'admin',
      password: 'password',
      token: '',
      debounceTimeRate: 1000
    };
  }

  // eslint-disable-next-line react/sort-comp
  conLog = () => {
    console.log('clicked');
  };

  debounce = (func, wait, immediate = false) => {
    let timeout;

    return function executedFunction() {
      const context = this;
      // eslint-disable-next-line prefer-rest-params
      const args = { ...arguments };

      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      const callNow = immediate && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(later, wait);

      if (callNow) func.apply(context, args);
    };
  };

  onSubmission = this.debounce(this.conLog, 1000);

  componentDidMount = () => {
    const token = sessionStorage.getItem('jwtToken');
    console.log('token', token);
    if (!token || token === '') return;
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
      // "body": JSON.stringify(data)
    };
    console.log('options', options);
    const url = 'http://localhost:8000';
    this.myFetch(url, options, this.handleLoginReAuthentication);
  };

  onUsernameChange = e => {
    e.preventDefault();
    console.log('onUsernameChange');
  };

  onPasswordChange = e => {
    e.preventDefault();
    console.log('onPasswordChange');
  };

  validation = e => {};

  submitCredentials = e => {
    e.preventDefault();
    const { username, password } = this.state;
    const data = { username, password };
    console.log('submiting credentials');
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(data)
    };
    const url = 'http://localhost:8000/login';
    this.myFetch(url, options, this.handleLoginSuccessFailure);
  };

  myFetch = async (url, options, callback) => {
    console.log('myFetch');
    await fetch(url, options)
      .then(response => {
        // console.log("response", response);
        return response.json();
      })
      .then(json => {
        callback(json);
        // this.setState()
      })
      .catch(error => {
        console.log('current Error:', error);
      });
  };

  handleLoginSuccessFailure = json => {
    const { success, token, messsage } = json;
    console.log('successful json:', json);
    if (success) {
      this.succussfulLogin(token);
    } else {
      this.unsuccesfulLogin(messsage);
    }
  };

  handleLoginReAuthentication = json => {
    const { success, token, messsage } = json;
    if (success) {
      // this.succussfulLogin(token);
      console.log('you are currently logged in');
    } else {
      // this.unsuccesfulLogin(messsage)
      alert('please log in');
    }
  };

  succussfulLogin = token => {
    this.setSession(token);
  };

  unsuccesfulLogin = messsage => {
    console.log('unsuccessful login:', messsage);
  };

  setSession = token => {
    sessionStorage.setItem('jwtToken', token);
    this.setState(() => ({ token }));
  };

  logout = () => {
    sessionStorage.removeItem('jwtToken');
  };

  render() {
    const {
      submitCredentials,
      onUsernameChange,
      onPasswordChange,
      logout,
      onSubmission
    } = this;
    const { username, password } = this.state;
    return (
      <div>
        <header className="speaker-form-header">
          <h1>Speaker submision</h1>
          <p>
            <em>Want to speak at our conference? Fill out this form</em>
          </p>
        </header>
        <form action="" method="get" className="speaker-form">
          <div className="form-row">
            <label htmlFor="fullName">Name</label>
            <input id="fullName" name="fullName" type="text" />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="joe@example.com"
            />
          </div>
          <fieldset className="legacy-form-row">
            <legend>Type of Talk</legend>
            <input
              id="talkType1"
              name="talkType"
              type="radio"
              value="mainStage"
            />
            <label htmlFor="talkType2" className="radioLabel">
              Main Stage
            </label>
            <input
              id="talkType2"
              name="talkType"
              type="radio"
              value="workshop"
            />
            <label htmlFor="talkType2" className="radioLabel">
              Workshop
            </label>
          </fieldset>
          <div className="form-row">
            <label htmlFor="tShirt">T-Shirt size</label>
            <select id="tShirt" name="tShirt">
              <option value="xs">Extra small</option>
              <option value="s">Small</option>
              <option value="m">Medium</option>
              <option value="l">Large</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="abstract">Abstract</label>
            <textarea id="abstract" name="abstract" />
            <div className="instructions">
              Describe your talk in 500 words or less
            </div>
          </div>
          <div className="form-row">
            <label className="checkbox-label" htmlFor="available" />
            <input
              id="available"
              name="available"
              type="checkbox"
              value="isAvailable"
            />
            <span> {`I'm actually available the date of the talk `} </span>
          </div>
          <div className="form-row">
            <button onClick={onSubmission} id="bu">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}
