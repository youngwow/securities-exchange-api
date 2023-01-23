const puppeteer = require('puppeteer');

// нужно выбрать AAPL и юзера Юля

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8080/');
    //await page.screenshot({ path: 'screenshot.png'});

    await page.type('#fieldForLogin', 'Юля')
    await delay(1000)
    // await page.keyboard.press('Enter');
    // await delay(1000)
    await page.click('.v-field__append-inner')
    await delay(1000)
    await page.keyboard.down('ControlLeft')
    await page.keyboard.down('Shift')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter');
    // await page.click('div > .v-list-item-title')
    await delay(1000)
    // await page.evaluate(() => {
    //     document.querySelector('.v-list-item-title').click();
    // });
    await page.click('#btnLogin')
    await delay(1000)
    // await page.mouse.move(0, 0)
    // await delay(1000)
    await page.screenshot({ path: 'screenshot1.png'});

    // await page.mouse.move(10, 10)
    await page.evaluate(() => {
        document.querySelector('#btnTrade').click();
    });
    await delay(1000)
    await page.screenshot({ path: 'screenshot2.png'});
    await page.type('#stockId1', '1', {delay: 1000})
    await page.screenshot({ path: 'screenshot3.png'});

    await page.click('#btnBuy1')
    await delay(1000)
    await page.screenshot({ path: 'screenshot4.png'});


    await browser.close();
})();