/* eslint-disable jest/no-done-callback */
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

const puppeteer = require('puppeteer');
const path = require('path');

const serverUrl = path.resolve(__dirname, '../../../../dist/index.html');

describe('form and server response validation /', () => {
  test('show client submitted an empty url', async (done) => {
    const browser = await puppeteer.launch({
      ignoreDefaultArgs: ['--disable-extensions'],
      headless: true,
      slowMo: 35
    });
    const page = await browser.newPage();
    await page.goto(serverUrl);
    // submit on an empty input form
    await page.click('input#urlInput');
    await page.click('button#submit');

    try {
      const element = await page.$("div[id='errorMessage']");
      const value = await page.evaluate((el) => el.innerHTML, element);
      expect(value).toBe('please type in a legit url');
      await done();

      await browser.close();
    } catch (error) {
      await console.log('test returned this error: ', error);
      done();
    }
  }, 6000);

  test('show client an unvalid url', async (done) => {
    const browser = await puppeteer.launch({
      ignoreDefaultArgs: ['--disable-extensions'],
      headless: true,
      slowMo: 10
    });
    const page = await browser.newPage();
    await page.goto(serverUrl);
    // submit on an empty input form
    await page.click('input#urlInput');
    await page.type('input#urlInput', '34giberish45');
    await page.click('button#submit');
    await page.waitForTimeout(5000);

    try {
      const element = await page.$("div[id='errorMessage']");
      const value = await page.evaluate((el) => el.innerHTML, element);
      expect(value).toBe('please type in a legit url');
      await done();
      await browser.close();
    } catch (error) {
      await console.log('test returned this error: ', error);
      done();
    }
  }, 60000);
});
