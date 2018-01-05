const path = require('path');
const puppeteer = require('puppeteer');

exports.capture = async function ({ basePath, baseUrl, snapshots }) {
    const sessionToken = (process.argv[2]||'').trim();

    if (!sessionToken) {
        console.log('Warning: no session token provided');
    }

    console.log('Capturing %s to %s', baseUrl, basePath);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('pageerror', err => {
        console.log('Page error: %s', err.toString());
    });

    page.on('error', err => {
        console.log('Error: %s', err.toString());
    });

    await page.setViewport({
        width: 1366,
        height: 768
    });

    if (sessionToken) {
        await page.setExtraHTTPHeaders({
            Authorization: 'Token '+sessionToken
        });
    }

    for (const key of Object.keys(snapshots)) {
        const snapshotSpec = typeof snapshots[key] == 'string' ? { url: snapshots[key] } : snapshots[pageKey];
        const snapshotUrl = snapshotSpec.url;
        const snapshotFilename = `${key}.png`;

        console.log('\tRendering %s to %s', snapshotUrl, snapshotFilename);

        try {
            await page.goto(path.join(baseUrl, snapshotUrl), {
                waitUntil: 'networkidle2'
            });

            if (snapshotSpec.waitFor) {
                await page.waitFor(snapshotSpec.waitFor);
            }

            await page.screenshot({
                path: path.join(basePath, snapshotFilename),
                fullPage: true
            });
        } catch (err) {
            console.log('\tFailed to capture page: %s', err.toString());
        }
    }

    await browser.close();

    console.log('done');
};