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
// send out requests to other pages
const superagent = require('superagent');
// create the multer for file and text form elements
const storage = multer.memoryStorage();
// use sqllite database
const sqlLite3 = require('sqlite3');

const upload = multer({ storage });
const urlListPath = path.join(__dirname, 'urlList.json');
const urlListJson = JSON.parse(fs.readFileSync(urlListPath, 'UTF-8'));
const { chunkLimit } = require('./severConstants');

const db = new sqlLite3.Database('./backEnd/server/wordDatabase.db');
let sql = '';

db.exec(`PRAGMA foreign_keys = ON`);
db.run(
  'CREATE TABLE IF NOT EXISTS urlTable (urlId INTEGER PRIMARY KEY AUTOINCREMENT, urlString TEXT, totalWords INTEGER)'
);

db.run(
  'CREATE TABLE IF NOT EXISTS wordTable (urlWordId INTEGER REFERENCES urlTable (urlId)ON DELETE CASCADE, word TEXT, count INTEGER )'
);

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
  res.header('Access-Control-Allow-Methods', 'DELETE, GET, POST, PUT, OPTIONS');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.post('/', upload.single('file'), (req, res, next) => {
  const { body } = req;
  // console.log('body', body);
  const { urlText } = body;
  // console.log('urlText', urlText);
  // @todo get the urlTextz
  superagent.get(urlText).end((err, resy) => {
    // check if the url was legit
    if (err) {
      const error = new Error('please type in a correct url ');
      error.httpStatusCode = 400;
      return next(error);
    }

    // process the text
    const textArray = resy.text.match(/\w+/g);

    const wordCountTable = new Map();
    let lowerC = '';

    // separate the words and count them
    textArray.forEach((row) => {
      lowerC = row.toLowerCase();
      if (wordCountTable.has(lowerC)) {
        wordCountTable.set(lowerC, wordCountTable.get(lowerC) + 1);
        return;
      }
      wordCountTable.set(lowerC, 1);
    });

    // database
    db.serialize(() => {
      sql = `INSERT INTO urlTable ( urlString, totalWords) VALUES('${urlText}', '${wordCountTable.size}')`;
      let currentId = 0;
      // eslint-disable-next-line func-names
      db.run(sql, [], function (er) {
        if (er) {
          console.log('err', er);
        }

        currentId = this.lastID;
        console.log('id is', currentId);
        // json
        // set the the count table in an array
        const wordCountTableArray = [];
        let chunk = [];
        let wordIndex = 0;
        const stmt = db.prepare(
          `INSERT INTO wordTable (urlWordId, word, count) VALUES (?,?,?)`
        );

        wordCountTable.forEach((count, word) => {
          if ((wordIndex + 1) % chunkLimit === 0) {
            chunk.push({ word, count });
            wordCountTableArray.push(chunk);
            chunk = [];
          } else {
            chunk.push({ word, count });
          }
          wordIndex += 1;
          stmt.run(currentId, word, count);
        });
        if (chunk.length > 0) wordCountTableArray.push(chunk);

        // stmt.finalize();

        // structure the object for hash table like lookup search.
        // const directory = {
        //   documentWordCount: wordIndex,
        //   wordCountTableArray
        // };

        // write the file
        // urlListJson[urlText] = directory;
        // fs.writeFileSync(urlListPath, JSON.stringify(urlListJson), (eror) => {
        //   if (eror) console.log('error at writing time');
        // });

        // return data the shows the selected urllist
        // const urls = Object.keys(urlListJson);
        const newstmt = `SELECT * FROM urlTable`;
        db.all(newstmt, [], (errors, row) => {
          let newChunkSize = Math.floor(wordCountTable.size / chunkLimit);
          newChunkSize = newChunkSize > 1 ? newChunkSize : 1;
          res.status(200).send({
            words: wordCountTableArray[0],
            historyUrl: row,
            currentSelectedUrl: urlText,
            errorMessage: '',
            totalChunks: newChunkSize
          });
          return next();
        });
      });
    });
  });
});

app.get('/', upload.single('file'), (req, res, next) => {
  // get initial url string and its words
  // console.log('urls', urls);

  // database
  sql = `SELECT * FROM urlTable`;

  db.all(sql, [], function (err, row) {
    if (err) console.log('err', err);
    console.log('rows', row);
    const historyUrl = Object.values(row);
    if (row.length < 1) {
      res.status(200).send({
        words: [],
        historyUrl: [],
        currentSelectedUrl: '',
        errorMessage: 'Enter a legit URL',
        totalChunks: 0
      });
      return next();
    }
    res.status(200).send({
      words: [],
      historyUrl,
      currentSelectedUrl: '',
      errorMessage: '',
      totalChunks: 1
    });
    return next();
  });
});

app.get('/urlSelected', (req, res, next) => {
  const { query } = req;
  const { selectedValue, urlId } = query;
  let { pageIndex } = query;
  pageIndex = parseInt(pageIndex, 10);
  let words = [];
  let startPos = 0;
  let endPos = 0;
  let chunkRatio = 0;
  console.log(' query', query);

  // const { selectedValue, pageIndex } = params;
  sql = `SELECT word, count FROM wordTable WHERE urlWordId='${urlId}'`;
  db.all(sql, [], function (err, row) {
    const len = row.length;
    chunkRatio = Math.ceil(len / chunkLimit);
    startPos = pageIndex * chunkLimit;
    if (chunkRatio >= 1) {
      endPos =
        chunkLimit * (pageIndex + 1) > len
          ? startPos + (len - startPos)
          : (pageIndex + 1) * chunkLimit;
      words = row.slice(startPos, endPos);
    } else {
      words = row;
    }
    const newChunkSize = Math.ceil(len / chunkLimit);

    res.status(200).send({
      words,
      historyUrl: [],
      currentSelectedUrl: { urlId, urlString: selectedValue },
      errorMessage: '',
      totalChunks: newChunkSize
    });
    return next();
  });
});

app.put('/', (req, res, next) => {
  const { query } = req;
  const { urlId, currentSelectedUrl } = query;
  console.log('query', query);
  sql = `UPDATE urlTable SET urlString='${currentSelectedUrl}' WHERE urlId = '${urlId}' `;
  db.run(sql, [], function (error, row) {
    console.log('put error', error);
  }).all(`SELECT urlString FROM urlTable`, [], function (error, row) {
    console.log('row', row);
    res.status(200).send({
      words: [],
      historyUrl: row,
      currentSelectedUrl,
      totalChunks: 0,
      errorMessage: ''
    });

    return next();
  });
});

app.delete('/', (req, res, next) => {
  // get the url and delete it
  // return a confirmation message
  const { query } = req;
  const { urlId } = query;
  console.log('query', query);
  sql = `DELETE FROM urlTable WHERE urlId= '${urlId}'`;
  db.all(sql, [], function () {}).all(
    `SELECT * FROM urlTable`,
    [],
    function (error, row) {
      console.log('row', row.length);
      res.status(200).send({
        words: [],
        historyUrl: row,
        currentSelectedUrl: '',
        totalChunks: 1,
        errorMessage: ''
      });

      return next();
    }
  );
});

module.exports = app;
/**
 * respond to post, incoming data url from the client application
 *
 * @param {*} { req, res, next}
 * @returns
 */
// app.post('/', upload.single('file'), (req, res, next) => {
//   const clientUrl = req.body.selectedUrl;
//   const { urlText, fetchUrls, pageIndex } = req.body;

//   // return the initial history of url if it exists
//   if (fetchUrls === 'true') {
//     const urls = Object.keys(urlListJson);
//     urls.unshift('Select a Url');
//     res.status(200).send({
//       data: [],
//       historyUrl: urls,
//       currentSelectedUrl: '',
//       totalChunks: 0
//     });
//     return next();
//   }

//   // if the string exists then return those words
//   if (urlListJson[clientUrl]) {
//     const urls = Object.keys(urlListJson);
//     urls.unshift('Select a Url');
//     res.status(200).send({
//       data: urlListJson[clientUrl].wordCountTableArray[pageIndex],
//       historyUrl: urls,
//       currentSelectedUrl: clientUrl,
//       totalChunks: urlListJson[clientUrl].wordCountTableArray.length
//     });
//     return next();
//   }

//   // check if the client typed in the url
//   if (urlText === 'null') {
//     const error = new Error('please type in a url ');
//     error.httpStatusCode = 400;
//     return next(error);
//   }

//   //  use superagent to make a file request and read the txt file
//   superagent.get(urlText).end((err, resy) => {
//     // check if the url was legit
//     if (err) {
//       const error = new Error('please type in a correct url ');
//       error.httpStatusCode = 400;
//       return next(error);
//     }

//     // process the text
//     const multerText = resy.text;
//     const textArray = multerText.match(/\w+/g);

//     const wordCountTable = new Map();
//     let lowerC = '';

//     // separate the words and count them
//     textArray.forEach((row) => {
//       lowerC = row.toLowerCase();
//       if (wordCountTable.has(lowerC)) {
//         wordCountTable.set(lowerC, wordCountTable.get(lowerC) + 1);
//         return;
//       }
//       wordCountTable.set(lowerC, 1);
//     });

//     // set the the count table in an array
//     const wordCountTableArray = [];
//     let chunk = [];
//     let wordIndex = 0;
//     wordCountTable.forEach((count, word) => {
//       if ((wordIndex + 1) % chunkLimit === 0) {
//         chunk.push({ word, count });
//         wordCountTableArray.push(chunk);
//         chunk = [];
//       } else {
//         chunk.push({ word, count });
//       }
//       wordIndex += 1;
//     });

//     if (chunk.length > 0) wordCountTableArray.push(chunk);

//     // structure the object for hash table like lookup search.
//     const directory = {
//       documentWordCount: wordIndex,
//       wordCountTableArray
//     };

//     // write the file
//     urlListJson[urlText] = directory;
//     fs.writeFileSync(urlListPath, JSON.stringify(urlListJson), (eror) => {
//       if (eror) console.log('error at writing time');
//     });

//     const urls = Object.keys(urlListJson);
//     urls.unshift('Select a Url');
//     res.status(200).send({
//       data: wordCountTableArray[0],
//       historyUrl: urls,
//       currentSelectedUrl: urlText,
//       totalChunks: wordCountTableArray.length
//     });
//   });
// });
