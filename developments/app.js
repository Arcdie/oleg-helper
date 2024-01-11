const fs = require('fs');
const { parseInstagramPage } = require('./puppeteer');

const url = 'https://www.instagram.com/den.mateush/';

const run = async () => {
  const content = await parseInstagramPage(url);
  console.log('content', content.length);
  // fs.writeFileSync('page.html', content);
};

run();
