"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config = {
    testDir: 'src/generateimage',
    /* Maximum time one test can run for. */
    timeout: 120 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 120000
    },
    retries: 0,
    use: {
        actionTimeout: 0,
    },
    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: {
                viewport: { height: 984, width: 1304 },
                userAgent: 'me',
                headless: true,
                deviceScaleFactor: 1.0,
                isMobile: false,
                hasTouch: false,
                defaultBrowserType: 'chromium'
            },
        }
    ],
    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    outputDir: 'tests/',
    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start'
    // },
};
exports.default = config;
