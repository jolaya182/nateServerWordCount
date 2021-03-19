/**
 * title: index.js
 *
 * date: 3/2/2020
 *
 * author: javier olaya
 *
 * description: this file handles all the end points for the 'agenda' application requrests
 */
// call in express
const { text } = require('express');
const express = require('express');
// invoke express
const app = express();
// port = 3000
const port = 3000;
// file structure
const fs = require('fs');
const path = require('path');

const thePathFile = path.join(__dirname, 'guidelines.txt');
const guidelines = fs.readFileSync(thePathFile, 'UTF-8');
const urlListPath = path.join(__dirname, 'urlList.json');
const urlListJson = JSON.parse(fs.readFileSync(urlListPath, 'UTF-8'));

console.log('urlListJson', urlListJson);

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
app.post('/', (req, res) => {
  console.log('req.body', req.body.name);
  console.log('google is ', urlListJson.google);

  if (urlListJson.google) {
    console.log('found google', urlListJson.google);
    urlListJson.google = 6;
    fs.writeFileSync(urlListPath, JSON.stringify(urlListJson), (err) => {
      if (err) console.log('error at writing time');
      console.log('congrats written');
    });
  }

  const textArray = guidelines.split(/[\r\n]+/g);
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

  // console.log('newArray', wordCountTableArray);

  res.status(200).send({ data: wordCountTableArray });
});

app.listen(port, () => console.log('listening to port:', port));
