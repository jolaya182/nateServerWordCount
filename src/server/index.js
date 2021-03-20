/* eslint-disable consistent-return */
/**
 * title: index.js
 *
 * date: 3/20/2020
 *
 * author: javier olaya
 *
 * description: this file handles all the end points for the 'nateSever' application requests
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
const path = require('path');
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
 *respond to post, incoming data is the star time and end time of the agenda application
 *
 * @param {*} { req, res, next}
 * @returns
 */
app.post('/', upload.single('file'), (req, res, next) => {
  const clientFile = req.file;
  const clientUrl = req.body.urlText;
  if (!clientFile) {
    const error = new Error('please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }
  const multerText = Buffer.from(clientFile.buffer).toString('utf-8');
  const textArray = multerText.split(/[\r\n]+/g);
  // console.log('textArray', textArray);
  const wordCountTable = new Map();
  textArray.forEach((row) => {
    // console.log('row', row);
    const words = row.trim().split(/[^A-Za-z0-9']/g);
    // console.log('words', words);

    words.forEach((word) => {
      if (wordCountTable.has(word)) {
        wordCountTable.set(word, wordCountTable.get(word) + 1);
        return;
      }
      wordCountTable.set(word, 1);
    });
  });
  // set the the count table
  const wordCountTableArray = [];
  wordCountTable.forEach((word, count) => {
    wordCountTableArray.push({ word, count });
  });

  const directory = {
    documentWordCount: wordCountTableArray.length,
    wordCountTableArray
  };
  urlListJson[clientUrl] = directory;
  fs.writeFileSync(urlListPath, JSON.stringify(urlListJson), (err) => {
    if (err) console.log('error at writing time');
    console.log('congrats written');
  });

  res.status(200).send({ data: wordCountTableArray });
});

app.listen(port, () => console.log('listening to port:', port));
