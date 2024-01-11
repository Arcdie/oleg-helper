const fs = require('fs');
const axios = require('axios');

const pageCode = 'shop_mens_clothing_';
const lsdToken = 'pEy-Gi3AItMLvXv_Pns0_8';

const results = [];
const POSTS_PER_REQUEST = 100;
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const run = async (page, after) => {
  console.log('page', page);

  try {
    const variables = page === 0
      ? {"data":{"count":POSTS_PER_REQUEST},"username": pageCode}
      : {"after": after,"before":null,"data":{"count":POSTS_PER_REQUEST},"first":POSTS_PER_REQUEST,"last":null,"username":pageCode}

    const response = await axios('https://www.instagram.com/api/graphql', {
      method: 'POST',
      /*
      proxy: {
        protocol: 'https',
        host: 'brd.superproxy.io',
        port: 22225,
        auth: {
          username: 'brd-customer-hl_d238800c-zone-data_center',
          password: 'x70b09xjfke5'
        }
      },
      */
      headers: {
        'x-fb-lsd': lsdToken,
      },
      data: `lsd=${lsdToken}&doc_id=7236321249746935&variables=${encodeURIComponent(JSON.stringify(variables))}`,
    });

    const data = response.data.data.xdt_api__v1__feed__user_timeline_graphql_connection;
    const pageInfo = data.page_info;

    fs.writeFileSync('./page-parser.json', JSON.stringify(response.data, null, 2));

    const newPosts = data.edges.map((e) => {
      const images = [];

      if (e.node.carousel_media) {
        e.node.carousel_media.forEach((m) => {
          images.push(m.image_versions2.candidates[0].url);
        });
      } else {
        images.push(e.node.image_versions2.candidates[0].url);
      }

      return {
        link: e.node.code,
        text: e.node.caption?.text || '',
        images,
      };
    });

    results.push(...newPosts);
    
    if (!pageInfo.has_next_page) {
      fs.writeFileSync('./page-parser-results.json', JSON.stringify(results, null, 2));
      return;
    }

    await sleep(1000);
    return run(page + 1, pageInfo.end_cursor);
  } catch (err) {
    console.log('err', err);
    fs.writeFileSync('./page-parser-results.json', JSON.stringify(results, null, 2));
    return;
  }
};

run(0);
