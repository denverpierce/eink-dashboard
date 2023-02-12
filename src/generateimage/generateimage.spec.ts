import { test, expect, chromium } from '@playwright/test';

test('Take Screenshot', async () => {
  const chromiumCDPCheck = await (await fetch('https://localhost:3333/json/version')).json();
  if (!('webSocketDebuggerUrl' in chromiumCDPCheck ||
    !(typeof chromiumCDPCheck.webSocketDebuggerUrl !== 'string'))) {
    console.error("Couldn't Chrome Devtool Server, exiting");
    process.exit();
  }

  const cdpUrl = chromiumCDPCheck.webSocketDebuggerUrl;
  const browser = await chromium.connectOverCDP(cdpUrl);
  const defaultContext = browser.contexts()[0];
  const page = defaultContext.pages()[0];

  await page.goto('http://localhost:3000/');
  await page.waitForSelector('.day-forecast-day');
  await page.waitForSelector('.highcharts-container ');
  const container = await page.$('.container');

  if (container) {
    await container.screenshot({
      path: 'output/generated_image.png',
      type: 'png'
    })
  }
});
