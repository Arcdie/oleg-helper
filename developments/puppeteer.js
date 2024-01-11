const puppeteer = require('puppeteer');

const initBrowser = () => puppeteer.launch({
  headless: false,
  // executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});

exports.parseInstagramPage = async (url) => {
  const browser = await initBrowser();
  const page = await browser.newPage();

  // await page.setViewport({ width: 1200, height: 800 });

  await page.goto(url, {
    timeout: 0,
    waitUntil: 'networkidle0',
  });

  const results = page.evaluate(async () => {  
    const results = [];

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const parsePage = () => {
      let targetLinks = [];
      const links = document.getElementsByTagName('a');

      for (let i = 0; i < links.length; i += 1) {
        if (links[i].getElementsByClassName('_aagu').length) {
          targetLinks.push(links[i]);
        }
      }

      if (!targetLinks.length) {
        return;
      }

      for (let i = 0; i < targetLinks.length; i += 1) {
        const contentLink = targetLinks[i].getAttribute('href');

        if (results.some((r) => r.contentLink === contentLink)) {
          continue;
        }

        const imgs = targetLinks[i].getElementsByTagName('img');
        const imageLink = imgs[0].getAttribute('src');
        const contentDescription = imgs[0].getAttribute('alt');
  
        results.push({
          imageLink,
          contentDescription,
          contentLink,
        });
      }
    };

    const waitFor = async () => new Promise((res, rej) => {
      const interval = setInterval(() => {
        const isLoadingSelector = document.querySelector('svg[aria-label="Загрузка…"]');
        // window.scrollTo(0, 999999);
  
        if (!isLoadingSelector) {
          clearInterval(interval);
          res();
        }
      }, 300);
    });

    parsePage();

    while (1) {
      window.scrollTo(0, 999999);
      await sleep(400);

      const isLoadingSelector = document.querySelector('svg[aria-label="Загрузка…"]');
      console.log('isLoadingSelector1', isLoadingSelector);

      if (!isLoadingSelector) {
        break;
      }

      await waitFor();
      parsePage();
    }

    return results;
  });

  // await browser.close();

  return results;
};
