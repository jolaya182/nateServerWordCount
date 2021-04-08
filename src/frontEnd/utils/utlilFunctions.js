export const stringBuilder = (objectToEncode, url) => {
  const esc = encodeURIComponent;
  const encodedString = Object.keys(objectToEncode)
    .map((key) => {
      return `${key}=${esc(objectToEncode[key])}`;
    })
    .join('&');
  return `${url}/?${encodedString}`;
};

/**
 *function that avoids triggering other functions to quickly
 *
 * @param {*} func
 * @param {*} delay
 * @return {*}
 */
export const debounce = (func, delay) => {
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
