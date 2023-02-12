import { test, expect, chromium } from '@playwright/test';

test('Take Screenshot', async () => {
console.log(process.env.CDP_URL);
const browser = await chromium.connectOverCDP(process.env.CDP_URL);
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
