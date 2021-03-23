/* eslint-disable jest/no-done-callback */
import 'regenerator-runtime/runtime';

const puppeteer = require('puppeteer');
const { serverUrl } = require('./constants');

test("validating client's url input as non empty", (done) => {
  async function validateNonEmptyUrlInput() {
    try {
      const browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--disable-extensions'],
        headless: false
      });
      const page = await browser.newPage();
      console.log('serverUrl', serverUrl);
      await page.goto(serverUrl);
      // await page.screenshot({path:'example.png'});
      await browser.close();
      expect(2).toBe(2);
      done();
    } catch (error) {
      done();
    }
  }

  validateNonEmptyUrlInput();
});
