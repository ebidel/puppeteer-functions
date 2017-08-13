// const {URL} = (typeof self !== 'undefined' && self.URL) || require('whatwg-url');
// const fetch = require('node-fetch');
const functions = require('firebase-functions');
const {Browser} = require('puppeteer');

(async() => {

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

exports.getVersion = functions.https.onRequest(async (req, res) => {
  const browser = new Browser();
  res.status(200).send(await browser.version());
  browser.close();
});

exports.fetchPage = functions.https.onRequest(async (req, res) => {
  let executablePath = req.query.browser || null;
  switch (executablePath) {
    case 'canary':
      executablePath = '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary';
      break;
    case 'chromium':
      executablePath = '/Applications/Chromium.app/Contents/MacOS/Chromium';
      break;
    default:
      // noop
  }

  const opts = {
    // headless: false,
    // ignoreHTTPSErrors: true,
    // args: ['--no-sandbox', '--enable-logging', '--enable-sandbox-logging', '--crash-dumps-dir=~./crashes']
    // args: ['--remote-debugging-port=9229']
  };
  if (executablePath) {
    opts.executablePath = executablePath;
  }

  try {
    const browser = new Browser(opts);
    // browser.stderr.pipe(process.stderr);
    // browser.stdout.pipe(process.stdout);

    const version = await browser.version();
    console.log(version);

    browser.close();

    res.status(200).send(version);

    // const page = await browser.newPage();
    // const response = await page.goto('https://example.com', {waitUntil: 'networkidle'});
    // const html = await response.text();
    // console.log(html);

    // res.status(response.status).send(version);
    // // await page.screenshot({path: 'example.png'});

    // // await page.close();
    // browser.close();
  } catch(e) {
    res.status(500).send(e.toString());
  }

  // res.set('Content-Type', 'application/json;charset=utf-8');
  // res.set('Cache-Control', 'private, max-age=300');
  // res.set('Access-Control-Allow-Origin', '*');
  // res.status(200).send('hi');
});

// ============================== USE LIGHTHOUSE ===============================
// const lighthouse = require('lighthouse');
// const chromeLauncher = require('lighthouse/chrome-launcher');
// const log = require('lighthouse-logger');

// const LH_FLAGS = {logLevel: 'info', output: 'json'};
// log.setLevel(LH_FLAGS.logLevel);

// async function launchChromeAndRunLighthouse(url, flags = {}, config = null) {
//   const chrome = await chromeLauncher.launch({
//     chromeFlags: ['--headless']
//   });
//   flags.port = chrome.port;
//   const results = await lighthouse(url, flags, config);
//   await chrome.kill();
//   return results;
// }

// exports.fetchPage = functions.https.onRequest(async (req, res) => {
//   launchChromeAndRunLighthouse('https://example.com', LH_FLAGS).then(results => {
//     res.status(200).json(results);
//   });
// });

})();
