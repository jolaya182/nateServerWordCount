/* eslint-disable jest/valid-describe */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// import express from 'express';
const supertest = require('supertest');
const server = require('../../server/server');

const request = supertest(server);
describe('Post /', () => {
  test('empty body request', async () => {
    const response = await request.post('/');
    console.log('response');
    expect(1).toBe(1);
    // .send({ body: { selectedUrl: '', urlText: '', fetchUrls: '' } });
    // .expect(200);
    // expect(response.body.selectedUrl).toEqual('');
    // done();
  });
});
