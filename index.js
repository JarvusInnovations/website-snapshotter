const path = require('path');
const puppeteer = require('puppeteer');

exports.capture = async function (destination, host, pages) {
    const sessionToken = (process.argv[2]||'').trim();

    if (!sessionToken) {
        console.log('Warning: no session token provided');
    }

    console.log('Capturing %s to %s', host, destination);

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

    for (const pageKey of Object.keys(pages)) {
        const pageSpec = typeof pages[pageKey] == 'string' ? { path: pages[pageKey] } : pages[pageKey];
        const pagePath = pageSpec.path;
        const pageFilename = `${pageKey}.png`;

        console.log('\tRendering %s to %s', pagePath, pageFilename);

        try {
            await page.goto(path.join(host, pagePath), {
                waitUntil: 'networkidle2'
            });

            if (pageSpec.waitFor) {
                await page.waitFor(pageSpec.waitFor);
            }

            await page.screenshot({
                path: path.join(destination, pageFilename),
                fullPage: true
            });
        } catch (err) {
            console.log('\tFailed to capture page: %s', err.toString());
        }
    }

    await browser.close();

    console.log('done');
};