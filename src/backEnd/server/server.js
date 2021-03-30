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
// const { urlencoded } = require('express');

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
  // res.header('Access-Control-Expose-Headers', 'Content-Encoding');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

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

app.post('/urlSelected/', upload.single('file'), (req, res, next) => {
  const {body} = req;
  console.log(' urlSelected body', body  )
  const {selectedUrl, pageIndex} = body;
  const urls = Object.keys(urlListJson);

  res.status(200).send({
    words: urlListJson[selectedUrl].wordCountTableArray[pageIndex],
    historyUrl: urls,
    currentSelectedUrl: selectedUrl,
    errorMessage: "",
    totalChunks: urlListJson[selectedUrl].wordCountTableArray.length
  });
  return next();
});

app.post('/', upload.single('file'), (req, res, next) => {
  let { body } = req;
  console.log('body', body);
  let { urlText } = body;
  console.log("urlText", urlText)
  // @todo get the urlText
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

    // return data the shows the selected urllist
    const urls = Object.keys(urlListJson);
    res.status(200).send({
      words: wordCountTableArray[0],
      historyUrl: urls,
      currentSelectedUrl: urlText,
      errorMessage: "",
      totalChunks: wordCountTableArray.length
    });

  });

})

app.get('/',  upload.single('file'),(req, res, next) => {
  // get initial url string and its words
  const urls = Object.keys(urlListJson);

  // console.log('req.body', req.data)
  if (!urlListJson[0]) {
    res.status(200).send({
      words: [],
      historyUrl: urls,
      currentSelectedUrl: "",
      errorMessage: "Enter a legit URL",
      totalChunks: 0
    })
    return next();
  }

  res.status(200).send({
    words: urlString[0],
    historyUrl: Object.keys(urlListJson),
    currentSelectedUrl: urlString,
    errorMessage: "",
    totalChunks: 1
  })

  return next();
})



app.put('/', (req, res, next) => {
  let { body } = req;

  res.status(200).send({
    data: "",
    historyUrl: "",
    currentSelectedUrl: "",
    totalChunks: ""
  })

  return next();
})

app.delete('/', (req, res, next) => {
  //get the url and delete it 
  //return a confirmation message
  res.status(200).send({
    data: "",
    historyUrl: "",
    currentSelectedUrl: "",
    totalChunks: ""
  })

  return next();
})


module.exports = app;
