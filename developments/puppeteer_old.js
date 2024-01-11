const puppeteer = require('puppeteer');

const initBrowser = () => puppeteer.launch({
  headless: false,
  // executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});

exports.parseInstagramPage = async (url) => {
  const browser = await initBrowser();
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 800 });

  await page.goto(url, {
    timeout: 0,
    waitUntil: 'networkidle0',
  });

  const results = [];

  const parsePage = async () => {
    const iterationResults = await page.evaluate(async () => {  
      const results = [];
      let targetLinks = [];
      const links = document.getElementsByTagName('a');

      for (let i = 0; i < links.length; i += 1) {
        if (links[i].getElementsByClassName('_aagu').length) {
          targetLinks.push(links[i]);
        }
      }

      if (!targetLinks.length) {
        return [];
      }

      for (let i = 0; i < targetLinks.length; i += 1) {
        const contentLink = targetLinks[i].getAttribute('href');
        const imgs = targetLinks[i].getElementsByTagName('img');
        const imageLink = imgs[0].getAttribute('src');
        const contentDescription = imgs[0].getAttribute('alt');

        results.push({
          imageLink,
          contentDescription,
          contentLink,
        });
      }
  
      return results;
    });

    iterationResults.forEach((iR) => {
      if (!results.some((r) => r.contentLink === iR.contentLink)) {
        results.push(iR);
      }
    });
  };

  await parsePage();

  

  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);

    const waitFor = async () => new Promise((res, rej) => {
      const interval = setInterval(() => {
        const isLoadingSelector = document.querySelector('svg[aria-label="Загрузка…"]');
  
        console.log('isLoadingSelector', isLoadingSelector);
  
        if (!isLoadingSelector) {
          clearInterval(interval);
          res();
        }
      }, 300);
    });

    await waitFor();
  });

  await parsePage();

  return results;

  // const pageContent = await page.content();



  



  // return pageContent;



  /*
  const idEmail = '#email';
  const idPassword = '#usercreds';
  const classLoginButton = '.btn.pull-right.btn-info';

  await page.focus(idEmail);
  await page.keyboard.type(config.helsi.login.toString());

  await page.focus(idPassword);
  await page.keyboard.type(config.helsi.password.toString());

  await page.focus(classLoginButton);
  await page.$eval(`input${classLoginButton}`, btn => btn.click());

  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.waitForSelector('#app', { visible: true, timeout: 0 });

  const client = await page.target().createCDPSession();
  const cookies = (await client.send('Network.getAllCookies')).cookies
    .filter(c => ['helsi.pro', '.helsi.pro'].includes(c.domain));

  await browser.close();

  const inactive = cookies.find(c => c.name === 'inactive');

  if (!inactive) {
    throw new Error('No inactive cookie');
  }

  return {
    value: cookies.map(c => `${c.name}=${c.value}`).join('; '),
    expireAt: Number(inactive.value),
  };
  */
};
