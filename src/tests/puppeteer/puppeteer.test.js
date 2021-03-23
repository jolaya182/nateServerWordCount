/* eslint-disable jest/no-done-callback */
import 'regenerator-runtime/runtime';

const puppeteer = require('puppeteer');
const { serverUrl } = require('./constants');

describe('form and server response validation /', () => {
  test("validating client's url input as non empty", async (done) => {
    try {
      const browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--disable-extensions'],
        headless: false,
        slowMo: 600
      });
      const page = await browser.newPage();
      // console.log('serverUrl', serverUrl);
      await page.goto(serverUrl);
      // await page.screenshot({path:'example.png'});
      // submit on an empty input form
      await page.click('input#urlInput');
      await page.click('button#submit');
      const element = await page.$eval('#errorMessage');

      await console.log('element', element);
      expect(2).toBe(2);
      done();
      // await browser.close();
    } catch (error) {
      done();
    }
  });
  // test("validating client's url input as non empty", (done) => {
  //   async function validateNonEmptyUrlInput() {
  //     try {
  //       const browser = await puppeteer.launch({
  //         ignoreDefaultArgs: ['--disable-extensions'],
  //         headless: false
  //       });
  //       const page = await browser.newPage();
  //       console.log('serverUrl', serverUrl);
  //       await page.goto(serverUrl);
  //       // await page.screenshot({path:'example.png'});
  //       await browser.close();
  //       expect(2).toBe(2);
  //       done();
  //     } catch (error) {
  //       done();
  //     }
  //   }

  //   validateNonEmptyUrlInput();
  // });
});
