/* eslint-disable consistent-return */
/**
 * title: index.js
 *
 * date: 3/20/2020
 *
 * author: javier olaya
 *
 * description: this file handles all the end points for the 'nateServer' application requests
 */

// call in express
const express = require('express');
// invoke express
const app = express();
// multer
const multer = require('multer');
// port = 3000
const port = 3000;
// file structure
const fs = require('fs');
// find directory
const path = require('path');
//
// const http = require('http');

// const request = require('request');

// const got = require('got');

const superagent = require('superagent');

// create the multer for file and text form elements
const storage = multer.memoryStorage();

//
const fileFilter = (req, file, next) => {
  if (file.mimetype === 'text/plain') {
    next(null, true);
  } else {
    next(null, false);
  }
};

const upload = multer({ fileFilter, storage });
const urlListPath = path.join(__dirname, 'urlList.json');
const urlListJson = JSON.parse(fs.readFileSync(urlListPath, 'UTF-8'));

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
 *respond to post, incoming data url from the client application
 *
 * @param {*} { req, res, next}
 * @returns
 */
app.post('/', upload.single('file'), (req, res, next) => {
  console.log('req.body', req.body);
  const clientUrl = req.body.selectedUrl;
  const { urlText, fetchUrls } = req.body;
  console.log('urlText', urlText); //

  if (fetchUrls === 'true') {
    res.status(200).send({
      data: [],
      historyUrl: Object.keys(urlListJson),
      currentSelectedUrl: ''
    });
    return next();
  }

  // if the string exists then return those words
  if (urlListJson[clientUrl]) {
    console.log('clienturl found', clientUrl);
    res.status(200).send({
      data: urlListJson[clientUrl].wordCountTableArray,
      historyUrl: Object.keys(urlListJson),
      currentSelectedUrl: clientUrl
    });
    return next();
  }

  // if not that then process the text
  // check if the client typed in the url
  if (urlText === 'null') {
    console.log('null', urlText);
    const error = new Error('please type in a url ');
    error.httpStatusCode = 400;
    return next(error);
  }

  // .send({ data: [{ string: 5 }] })
  superagent.get(urlText).end((err, resy) => {
    // console.log('res', res);
    // if not that then process the text
    if (err) {
      const error = new Error('please type in a correct url ');
      error.httpStatusCode = 400;
      // res.status(400).send(error);
      return next(error);
    }
    const multerText = JSON.stringify(resy.text);
    const textArray = multerText.split(/[\r\n]+/g);
    // console.log('textArray', textArray);
    const wordCountTable = new Map();
    let lowerC = '';
    textArray.forEach((row) => {
      // console.log('row', row);
      const words = row.trim().split(/[^A-Za-z']/g);
      // console.log('words', words);

      words.forEach((word) => {
        lowerC = word.toLowerCase();
        if (wordCountTable.has(lowerC)) {
          wordCountTable.set(lowerC, wordCountTable.get(lowerC) + 1);
          return;
        }
        wordCountTable.set(lowerC, 1);
      });
    });
    // set the the count table
    const wordCountTableArray = [];
    wordCountTable.forEach((count, word) => {
      wordCountTableArray.push({ word, count });
    });

    const directory = {
      documentWordCount: wordCountTableArray.length,
      wordCountTableArray
    };
    urlListJson[urlText] = directory;
    fs.writeFileSync(urlListPath, JSON.stringify(urlListJson), (eror) => {
      if (eror) console.log('error at writing time');
      console.log('congrats written');
    });
    // console.log('Object.keys(urlListJson)', Object.keys(urlListJson));
    res.status(200).send({
      data: wordCountTableArray,
      historyUrl: Object.keys(urlListJson),
      currentSelectedUrl: urlText
    });
  });
});

app.listen(port, () => console.log('listening to port:', port));
