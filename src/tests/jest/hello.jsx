// hello.jsx

import React from 'react';
import PropTypes from 'prop-types';

export default function Hello(props) {
  const { name } = props;
  if (name) {
    return <h1>{`Hello,${name}!`}</h1>;
  }
  return <span>Hey, stranger</span>;
}

Hello.propTypes = {
  name: PropTypes.string
};

Hello.defaultProps = {
  name: null
};
