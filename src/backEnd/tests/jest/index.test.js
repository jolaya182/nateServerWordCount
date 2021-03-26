/* eslint-disable jest/no-done-callback */
/* eslint-disable jest/valid-describe */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * title: puppeteer.test.js
 *
 * date: 3/22/2020
 *
 * author: javier olaya
 *
 * description: this file handles all the form submission and words rendering
 */
import 'regenerator-runtime/runtime';

const supertest = require('supertest');
const server = require('../../server/server');
const { outdoorsysequence, norvig } = require('../puppeteer/constants');

const request = supertest(server);
describe('Post /', () => {
  test('process word count of 10 a txt file from a webpage', (done) => {
    async function processTxtWordCount10(data) {
      try {
        const urlText = outdoorsysequence;
        const documentWordCount = 8;
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

  test('process word count of 500 a txt file from a webpage', (done) => {
    async function processTxtWordCount500(data) {
      try {
        const urlText = norvig;
        const documentWordCount = 500;
        const response = await request
          .post('/')
          .send({ selectedUrl: '', urlText, fetchUrls: false })
          .expect(200);
        expect(response.body.data).toHaveLength(documentWordCount);
        done();
      } catch (error) {
        done(error);
      }
    }
    processTxtWordCount500();
  });
});
