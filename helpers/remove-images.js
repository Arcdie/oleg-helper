const axios = require('axios');

const ACCOUNT_ID = '9bdca6ad502608a62958217c013ad7d7';
const API_TOKEN = 'z1E6FTDsKeilvB2zQL2zoqrjbjfXfx4a1HtismhF';

const headers = {
  Authorization: `Bearer ${API_TOKEN}`,
};

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const getQueue = (arr, limiter) => {
  const queues = [];
  const lArr = arr.length;

  let targetIndex = 0;
  const numberIterations = Math.ceil(lArr / limiter);

  for (let i = 0; i < numberIterations; i += 1) {
    const newQueue = [];

    let conditionValue = limiter;

    if (i === numberIterations - 1) {
      conditionValue = lArr - targetIndex;
    }

    for (let j = 0; j < conditionValue; j += 1) {
      newQueue.push(arr[targetIndex]);
      targetIndex += 1;
    }

    queues.push(newQueue);
  }

  return queues;
};

async function getImageIds(page = 1) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1?page=${page}&per_page=100`;
  const { data } = await axios.get(url, { headers });
  return data.result;
}

async function deleteImage(id) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1/${id}`;
  await axios.delete(url, { headers });
  console.log(`Deleted image ${id}`);
}

(async () => {
  let page = 1;
  let images;

  do {
    const response = await getImageIds(page);

    images = response.images;
    const queue = getQueue(response.images, 10);

    for (const e of queue) {
      await Promise.all(e.map(async i => {
        await deleteImage(i.id);
      }));

      await sleep(1000);
    }

    await sleep(5000);
    page++;
    console.log('page', page);
  } while (images.length === 100); // keep going if max per page is hit
})();