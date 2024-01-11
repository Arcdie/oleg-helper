const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const POSTS_PER_REQUEST = 100;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pageCode = 'alyonapovarchuk';
const lsdToken = 'pEy-Gi3AItMLvXv_Pns0_8';

const httpsAgent = new HttpsProxyAgent({
  host: 'brd.superproxy.io',
  port: 22225,
  auth: 'brd-customer-hl_d238800c-zone-data_center:x70b09xjfke5',
});

const run = async () => {
  const page = 0;
  const variables = page === 0
    ? {"data":{"count":POSTS_PER_REQUEST},"username": pageCode}
    : {"after": after,"before":null,"data":{"count":POSTS_PER_REQUEST},"first":POSTS_PER_REQUEST,"last":null,"username":pageCode}

  const response = await axios.post('https://www.instagram.com', {
    proxy: {
      // protocol: 'https',
      host: 'brd.superproxy.io',
      port: 22225,
      auth: {
        username: 'brd-customer-hl_d238800c-zone-data_center',
        password: 'x70b09xjfke5'
      }
    },
    headers: {
      'x-fb-lsd': lsdToken,
    },
    data: `lsd=${lsdToken}&doc_id=7236321249746935&variables=${encodeURIComponent(JSON.stringify(variables))}`,
  });

  console.log('response', response.data);
};

run();
