/**
 * title: MainMenu.jsx
 *
 * date: / /
 *
 * author: javier olaya
 *
 * description: this component handles the menu aspect of the webpage
 */
// main menu page component
import React from 'react';
import { NavLink } from 'react-router-dom';
// bring what ever component to render

const selectedStyle = {
  color: 'slategrey',
  backgroundColor: 'white'
};

const MainMenu = () => (
  <aside className="aside-bar">
    <nav className="main-menu">
      <NavLink to="/Profile" activeStyle={selectedStyle}>
        [Profile]
      </NavLink>
      <NavLink to="/Feature" activeStyle={selectedStyle}>
        [Feature]
      </NavLink>
    </nav>
  </aside>
);

export default MainMenu;
