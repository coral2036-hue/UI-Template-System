const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });

  // S4 mockup
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 680, height: 520, deviceScaleFactor: 2 });
  await page1.goto('http://localhost:5520', { waitUntil: 'networkidle0' });
  await page1.screenshot({
    path: path.join(__dirname, 'mockup_s4.png'),
    fullPage: true,
  });
  console.log('mockup_s4.png saved');

  // S9/S10 Before mockup
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 820, height: 580, deviceScaleFactor: 2 });
  const beforeHtml = 'file:///' + path.join(__dirname, 'mockup_before_s9.html').replace(/\\/g, '/');
  await page2.goto(beforeHtml, { waitUntil: 'networkidle0' });
  await page2.screenshot({
    path: path.join(__dirname, 'mockup_s9_before.png'),
    fullPage: true,
  });
  console.log('mockup_s9_before.png saved');

  // S9/S10 After mockup
  const page3 = await browser.newPage();
  await page3.setViewport({ width: 820, height: 600, deviceScaleFactor: 2 });
  const afterHtml = 'file:///' + path.join(__dirname, 'mockup_after_s9.html').replace(/\\/g, '/');
  await page3.goto(afterHtml, { waitUntil: 'networkidle0' });
  await page3.screenshot({
    path: path.join(__dirname, 'mockup_s9_after.png'),
    fullPage: true,
  });
  console.log('mockup_s9_after.png saved');

  await browser.close();
})();
