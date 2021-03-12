/* eslint-disable react/jsx-one-expression-per-line */
/**
 * title: MiddleBody.jsx
 *
 * date: / /
 *
 * author: javier olaya
 *
 * description: this component handles the menu aspect of the webpage
 */
// main menu page component
import React from 'react';
import MyForm from '../components/UtilComponents/MyForm';

// import { NavLink } from 'react-router-dom';
// bring what ever component to render

// const selectedStyle = {
//   color: 'slategrey',
//   backgroundColor: 'white'
// };

const MiddleBody = () => (
  <div className="middle-wrapper">
    <div className="middle-section">
      <header className=" middle-header ">
        <h3 className=" MiddleTopBody">MiddleTopBody</h3>
      </header>
      <section className="secticle">Section</section>
      <section className="secticle form-Container">
        <MyForm />
      </section>
      <article className="secticle">Article</article>
      <article className="secticle paragraph-ident">
        <h2>Web Fonts</h2>
        <p>
          This paragraph is using a web font call
          <em> Roboto Light </em>
          {` . It’s a little more refined and lends some`}
          <strong>{` unique character`}</strong>
          {` to the web page.`}
        </p>
        <p>
          Everything in typography is about being subtle, and styling the
          separation between paragraphs is no different.
        </p>
      </article>
    </div>
  </div>
);

export default MiddleBody;
