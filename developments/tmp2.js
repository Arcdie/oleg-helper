const fs = require('fs');
const axios = require('axios');

const run = async () => {
  const res = await axios('https://www.instagram.com/api/v1/users/web_profile_info/?username=sun.and.j', {
    "headers": {
      "accept": "*/*",
      "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,uk;q=0.6",
      "dpr": "2",
      "sec-ch-prefers-color-scheme": "dark",
      "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
      "sec-ch-ua-full-version-list": "\"Not_A Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"120.0.6099.109\", \"Google Chrome\";v=\"120.0.6099.109\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": "\"\"",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-ch-ua-platform-version": "\"12.6.7\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "viewport-width": "1280",
      "x-asbd-id": "129477",
      "x-csrftoken": "KXdFrNpzvLmEf7UoNUn5hy",
      "x-ig-app-id": "936619743392459",
      "x-ig-www-claim": "hmac.AR0dCf1pkxPtsqkyALY2ww8sAN7AwZu4aF_1wPN5w4b5wgmU",
      "x-requested-with": "XMLHttpRequest"
    },
  });

  fs.writeFileSync('./tmp2.json', JSON.stringify(res.data, null, 2));
  // console.log('res', res.data);
};

run();

