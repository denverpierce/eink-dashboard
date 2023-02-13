import { test, expect, chromium } from '@playwright/test';

test('Take Screenshot', async () => {
  let maybeCDPUrl: string | null = null;
  try {
    const cdpList = await fetch('http://127.0.0.1:3333/json/version', { headers: { 'Content-Type': 'application/json' }});
    const cdpResponse = await cdpList.json();
    if (!('webSocketDebuggerUrl' in cdpResponse) ||
      typeof cdpResponse.webSocketDebuggerUrl !== 'string') {
      console.error("Couldn't parse Chrome Devtool Server response, exiting");
      process.exit();
    }
    console.log(`Got the following as the cdp url: ${cdpResponse.webSocketDebuggerUrl}`)
    maybeCDPUrl = cdpResponse.webSocketDebuggerUrl;
  } catch (error) {
    console.error("Couldn't get Chrome Devtool Server list, exiting");
    console.log(error)
  }
  if(!maybeCDPUrl || typeof maybeCDPUrl !== 'string'){
    console.error(`Couldn't get valid CDP url, instead got: ${maybeCDPUrl}`);
    process.exit();
  }

  const browser = await chromium.connectOverCDP(maybeCDPUrl);
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
