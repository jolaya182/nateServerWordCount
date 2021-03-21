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
 *respond to post, incoming data is the star time and end time of the agenda application
 *
 * @param {*} { req, res, next}
 * @returns
 */
app.post('/', upload.single('file'), (req, res, next) => {
  // const clientFile = req.file;
  const clientUrl = req.body.urlText;
  console.log('clientUrl', clientUrl); //

  if (!clientUrl) {
    const error = new Error('please type in a url ');
    error.httpStatusCode = 400;
    return next(error);
  }

  // if the string exists then return those words
  if (urlListJson[clientUrl]) {
    // documentWordCount":48592,"wordCountTableArray
    console.log('clienturl found', clientUrl);
    res.status(200).send({
      data: urlListJson[clientUrl].wordCountTableArray,
      historyUrl: Object.keys(urlListJson)
    });
    return next();
  }
  // if not that then process the text

  // .send({ data: [{ string: 5 }] })
  superagent.get(clientUrl).end((err, resy) => {
    // console.log('res', res);

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
    urlListJson[clientUrl] = directory;
    fs.writeFileSync(urlListPath, JSON.stringify(urlListJson), (eror) => {
      if (eror) console.log('error at writing time');
      console.log('congrats written');
    });

    res.status(200).send({
      data: wordCountTableArray,
      historyUrl: Object.keys(urlListJson)
    });
  });
});

// app.post('/', (req, res, next) => {
//   console.log('req.body.urlText', req.body.urlText);
//   (async () => {
//     // '/', upload.single('file'), (requ, res, next);
//     const response = await got('http://norvig.com/big.txt').text();
//     // got
//     // console.log('body.urlText', req.body);
//     const clientFile = req.file;
//     const clientUrl = req.body.urlText;
//     console.log('clientUrl:', clientUrl);
//     if (!clientFile) {
//       const error = new Error('please upload a file');
//       error.httpStatusCode = 400;
//       return next(error);
//     }

//     const multerText = response;
//     const textArray = multerText.split(/[\r\n]+/g);
//     // console.log('textArray', textArray);
//     const wordCountTable = new Map();
//     textArray.forEach((row) => {
//       // console.log('row', row);
//       const words = row.trim().split(/[^A-Za-z0-9']/g);
//       // console.log('words', words);

//       words.forEach((word) => {
//         if (wordCountTable.has(word)) {
//           wordCountTable.set(word, wordCountTable.get(word) + 1);
//           return;
//         }
//         wordCountTable.set(word, 1);
//       });
//     });
//     // set the the count table
//     const wordCountTableArray = [];
//     wordCountTable.forEach((word, count) => {
//       wordCountTableArray.push({ word, count });
//     });

//     const directory = {
//       documentWordCount: wordCountTableArray.length,
//       wordCountTableArray
//     };
//     urlListJson[clientUrl] = directory;
//     fs.writeFileSync(urlListPath, JSON.stringify(urlListJson), (err) => {
//       if (err) console.log('error at writing time');
//       console.log('congrats written');
//     });

//     res.status(200).send({ data: wordCountTableArray });
//   })();
// });

// app.post('/', upload.single('file'), (req, res, next) => {
//   console.log('req.body', req.body);
//   const clientFile = req.file;
//   const clientUrl = req.body.urlText;
//   console.log('resp', req.body.urlText);
//   // if (!clientFile) {
//   //   const error = new Error('please upload a file');
//   //   error.httpStatusCode = 400;
//   //   return next(error);
//   // }

//   request('http://norvig.com/big.txt', { json: true }, (err, resp, body) => {
//     if (err) {
//       return console.log('error:', err);
//     }
//     // console.log(body.url);
//     // console.log(body.explanation);
//     const multerText = body;
//     const textArray = multerText.split(/[\r\n]+/g);
//     // console.log('textArray', textArray);
//     const wordCountTable = new Map();
//     textArray.forEach((row) => {
//       // console.log('row', row);
//       const words = row.trim().split(/[^A-Za-z0-9']/g);
//       // console.log('words', words);

//       words.forEach((word) => {
//         if (wordCountTable.has(word)) {
//           wordCountTable.set(word, wordCountTable.get(word) + 1);
//           return;
//         }
//         wordCountTable.set(word, 1);
//       });
//     });
//     // set the the count table
//     const wordCountTableArray = [];
//     wordCountTable.forEach((word, count) => {
//       wordCountTableArray.push({ word, count });
//     });

//     const directory = {
//       documentWordCount: wordCountTableArray.length,
//       wordCountTableArray
//     };
//     urlListJson[clientUrl] = directory;
//     fs.writeFileSync(urlListPath, JSON.stringify(urlListJson), (err) => {
//       if (err) console.log('error at writing time');
//       console.log('congrats written');
//     });

//     res.status(200).send({ data: wordCountTableArray });
//   });
// }); // end

// app.get('/', upload.single('file'), (req, res, next) => {
//   // todo account for https require https, check string for https
//   console.log('req.body', req.body.urlText);
//   const clientUrl = req.body;
//   if (!clientUrl) {
//     const error = new Error('please type a url with a txt ');
//     error.httpStatusCode = 400;
//     return next(error);
//   }

//   http
//     .get('http://norvig.com/big.txt', (resp) => {
//       let data = '';

//       resp.on('data', (chunk) => {
//         data += chunk;
//         console.log('http success');

//         const multerText = data;
//         const textArray = multerText.split(/[\r\n]+/g);
//         // console.log('textArray', textArray);
//         const wordCountTable = new Map();
//         textArray.forEach((row) => {
//           // console.log('row', row);
//           const words = row.trim().split(/[^A-Za-z0-9']/g);
//           // console.log('words', words);

//           words.forEach((word) => {
//             if (wordCountTable.has(word)) {
//               wordCountTable.set(word, wordCountTable.get(word) + 1);
//               return;
//             }
//             wordCountTable.set(word, 1);
//           });
//         });
//         // set the the count table
//         const wordCountTableArray = [];
//         wordCountTable.forEach((word, count) => {
//           wordCountTableArray.push({ word, count });
//         });

//         const directory = {
//           documentWordCount: wordCountTableArray.length
//         };
//         urlListJson[clientUrl] = directory;
//         urlListJson['http://norvig.com/big.txt'] = directory;
//         fs.writeFileSync(urlListPath, JSON.stringify(urlListJson), (err) => {
//           if (err) console.log('error at writing time');
//           console.log('congrats written');
//         });

//         res.status(200).send({ data: wordCountTableArray });
//         // res.status(200).send({ data: wordCountTableArray });
//       });

//       resp.on('end', () => {
//         console.log('http success');
//         console.log(JSON.parse(data));
//       });
//     })
//     .on('error', (err) => {
//       console.log('Error:', err.message);
//     });
// }); // end of the get route

// app.post('/', upload.single('file'), (req, res, next) => {
//   console.log('req.url', req.url);
//   const clientFile = req.file;
//   const clientUrl = req.body.urlText;
//   if (!clientFile) {
//     const error = new Error('please upload a file');
//     error.httpStatusCode = 400;
//     return next(error);
//   }
//   const multerText = Buffer.from(clientFile.buffer).toString('utf-8');
//   const textArray = multerText.split(/[\r\n]+/g);
//   // console.log('textArray', textArray);
//   const wordCountTable = new Map();
//   textArray.forEach((row) => {
//     // console.log('row', row);
//     const words = row.trim().split(/[^A-Za-z0-9']/g);
//     // console.log('words', words);

//     words.forEach((word) => {
//       if (wordCountTable.has(word)) {
//         wordCountTable.set(word, wordCountTable.get(word) + 1);
//         return;
//       }
//       wordCountTable.set(word, 1);
//     });
//   });
//   // set the the count table
//   const wordCountTableArray = [];
//   wordCountTable.forEach((word, count) => {
//     wordCountTableArray.push({ word, count });
//   });

//   const directory = {
//     documentWordCount: wordCountTableArray.length,
//     wordCountTableArray
//   };
//   urlListJson[clientUrl] = directory;
//   fs.writeFileSync(urlListPath, JSON.stringify(urlListJson), (err) => {
//     if (err) console.log('error at writing time');
//     console.log('congrats written');
//   });

//   res.status(200).send({ data: wordCountTableArray });
// });

app.listen(port, () => console.log('listening to port:', port));
