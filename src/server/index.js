/* eslint-disable consistent-return */
/**
 * title: index.js
 *
 * date: 3/20/2020
 *
 * author: javier olaya
 *
 * description: this file handles all the end points for the 'nateServer' application requests
 * and processes the words of a text file from external urls
 */

// call in express
const express = require('express');
// invoke express
const app = express();
// multer
const multer = require('multer');
// file structure
const fs = require('fs');
// find directory
const path = require('path');
const superagent = require('superagent');

// create the multer for file and text form elements
const storage = multer.memoryStorage();

const upload = multer({ storage });
const urlListPath = path.join(__dirname, 'urlList.json');
const urlListJson = JSON.parse(fs.readFileSync(urlListPath, 'UTF-8'));
const { chunkLimit } = require('./severConstants');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 *set the headers
 *
 * @param {*} { req, res, next}
 * @returns
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

/**
 * respond to post, incoming data url from the client application
 *
 * @param {*} { req, res, next}
 * @returns
 */
app.post('/', upload.single('file'), (req, res, next) => {
  const clientUrl = req.body.selectedUrl;
  const { urlText, fetchUrls, pageIndex } = req.body;

  // return the initial history of url if it exists
  if (fetchUrls === 'true') {
    const urls = Object.keys(urlListJson);
    urls.unshift('Select a Url');
    res.status(200).send({
      data: [],
      historyUrl: urls,
      currentSelectedUrl: '',
      totalChunks: 0
    });
    return next();
  }

  // if the string exists then return those words
  if (urlListJson[clientUrl]) {
    const urls = Object.keys(urlListJson);
    urls.unshift('Select a Url');
    res.status(200).send({
      data: urlListJson[clientUrl].wordCountTableArray[pageIndex],
      historyUrl: urls,
      currentSelectedUrl: clientUrl,
      totalChunks: urlListJson[clientUrl].wordCountTableArray.length
    });
    return next();
  }

  // check if the client typed in the url
  if (urlText === 'null') {
    const error = new Error('please type in a url ');
    error.httpStatusCode = 400;
    return next(error);
  }

  //  use superagent to make a file request and read the txt file
  superagent.get(urlText).end((err, resy) => {
    // check if the url was legit
    if (err) {
      const error = new Error('please type in a correct url ');
      error.httpStatusCode = 400;
      return next(error);
    }

    // process the text
    const multerText = JSON.stringify(resy.text);
    const textArray = multerText.split(/\n|\\n|\r|\\/g);
    console.log('textArray', textArray);
    const wordCountTable = new Map();
    let lowerC = '';

    // separate the words and count them
    textArray.forEach((row) => {
      const words = row.trim().split(/[^A-Za-z']/g);
      words.forEach((word) => {
        lowerC = word.toLowerCase();
        if (wordCountTable.has(lowerC)) {
          wordCountTable.set(lowerC, wordCountTable.get(lowerC) + 1);
          return;
        }
        wordCountTable.set(lowerC, 1);
      });
    });

    // set the the count table in an array
    const wordCountTableArray = [];
    let chunk = [];
    let wordIndex = 0;
    wordCountTable.forEach((count, word) => {
      if ((wordIndex + 1) % chunkLimit === 0) {
        chunk.push({ word, count });
        wordCountTableArray.push(chunk);
        chunk = [];
      } else {
        chunk.push({ word, count });
      }
      wordIndex += 1;
    });

    if (chunk.length > 0) wordCountTableArray.push(chunk);

    // structure the object for hash table like lookup search.
    const directory = {
      documentWordCount: wordIndex,
      wordCountTableArray
    };

    // write the file
    urlListJson[urlText] = directory;
    fs.writeFileSync(urlListPath, JSON.stringify(urlListJson), (eror) => {
      if (eror) console.log('error at writing time');
    });

    const urls = Object.keys(urlListJson);
    urls.unshift('Select a Url');
    res.status(200).send({
      data: wordCountTableArray[0],
      historyUrl: urls,
      currentSelectedUrl: urlText,
      totalChunks: wordCountTableArray.length
    });
  });
});
const port = 3000;
app.listen(port, () => console.log('listening to port:', port));
module.exports = app;
