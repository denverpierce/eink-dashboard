import { test, expect, chromium } from '@playwright/test';

test('Take Screenshot', async ({ page }) => {
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
