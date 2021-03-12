/* eslint-disable react/jsx-one-expression-per-line */
/**
 * title: Header.jsx
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this component handles the date at the top of the page
 */
import React from 'react';

/**
 *displays the date of the day of the agenda
 *
 * @returns component
 */
const Header = () => {
  return (
    <div className="row">
      <div className="column">
        <div className="top-date">Friday, April 1</div>
      </div>
    </div>
  );
};
export default Header;
