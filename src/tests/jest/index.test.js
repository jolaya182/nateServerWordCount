/* eslint-disable jest/no-done-callback */
/* eslint-disable jest/valid-describe */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// import express from 'express';
import 'regenerator-runtime/runtime';

const supertest = require('supertest');
const server = require('../../server/server');

const request = supertest(server);
describe('Post /', () => {
  test('process word count of 10 a txt file from a webpage', (done) => {
    async function processTxtWordCount10(data) {
      try {
        const urlText = 'http://www.outdoorsysequence.com/bla.txt';
        const documentWordCount = 10;
        const response = await request
          .post('/')
          .send({ selectedUrl: '', urlText, fetchUrls: false })
          .expect(200);
        // console.log(response.body);
        expect(response.body.data).toHaveLength(documentWordCount);
        done();
      } catch (error) {
        done(error);
      }
    }
    processTxtWordCount10();
  });

  test('process word count of 41569 a txt file from a webpage', (done) => {
    async function processTxtWordCount41569(data) {
      try {
        const urlText = 'https://norvig.com/big.txt';
        const documentWordCount = 41569;
        const response = await request
          .post('/')
          .send({ selectedUrl: '', urlText, fetchUrls: false })
          .expect(200);
        // console.log(response.body);
        expect(response.body.data).toHaveLength(documentWordCount);
        done();
      } catch (error) {
        done(error);
      }
    }
    processTxtWordCount41569();
  });
});
