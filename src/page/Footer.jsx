/**
 * title: Footer.jsx
 *
 * date: / /
 *
 * author: javier olaya
 *
 * description: this component handles the menu aspect of the webpage
 */
// main menu page component
import React from 'react';
// import { NavLink } from 'react-router-dom';
// bring what ever component to render

// const selectedStyle = {
//   color: 'slategrey',
//   backgroundColor: 'white'
// };

const Footer = () => (
  <footer className="footer-class">
    <h3 className="footer-piece">FooterHeader</h3>
    <address className="footer-piece">address</address>
    <time className="footer-piece"> time</time>
    <figcaption className="footer-piece">figure caption</figcaption>
  </footer>
);

export default Footer;
