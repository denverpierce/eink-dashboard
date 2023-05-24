"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)('Take Screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('.day-forecast-day');
    await page.waitForSelector('.highcharts-container ');
    const container = await page.$('.container');
    if (container) {
        await container.screenshot({
            path: 'output/generated_image.png',
            type: 'png'
        });
    }
});
