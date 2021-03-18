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
app.post('/',(req, res, next) => {
    console.log('post nate requests');
    const doc = "things I know.\ndownload the codebase\nbackend\rcreate the server\ncreate the hash table\nread the file\nseperate the file by rows\nfor each row seperate it by spaces\ronce seperated add it to a hashtable\rsend the table count to the client\nstore the table onto the state of the application\ncreate a form that has an input text box, file input, delete, add another server url box.\nonce create allow for a button submission to send the string and the \nonce the table count is received, update the  of url and file.\ron the front end\ruse react\rtests\non the front end\nchar and number validation (string, file object)s\nthat the form is not empty url, and file.\rcss, use flexbox. \ruse some gredients, and solid color on the forms\rthings I dont know\nhow to send a file from the client side\nhow to extract the file from the client request on the server.\nhow to create a jest test to check for chars and strings, a file object are not \nempty on submission.\ncreate a react hook.\nfirst hour set up the mvp on the server side\nsecond hour set up the mvp on the client side\nthird hour work out the the things I don't know\nfourth hour readme update, refactor, clean up the commenting section, formating and gif creation."
    // extract the file  and url from the request.
    // const doc = fs.readFileSync( , 'UTF-8');


  const file = req.files;
  console.log('file', file);


    const textArray = doc.split('/\r?\n/');
    // const wordCountTable = new Map();
    // textArray.forEach((row)=>{
    //   const words = row.split('/[w,\s]/g');
    //   // console.log('words', words);
    //     words.forEach((word)=>{
    //       if(wordCountTable.has(word)){
    //         wordCountTable.set( word, wordCountTable.get(word)+ 1 );
    //         return;
    //       }
    //       wordCountTable.set( word, 1 );
    //       return;
    //     });
    // })
    // // set the the count table
    res.send({data:[{word:"wordCountTable", count: 3}]});
    // next();
  },
  // GroupedActivityController.loadData
);

app.listen(port, () => console.log('listening to port:', port));
