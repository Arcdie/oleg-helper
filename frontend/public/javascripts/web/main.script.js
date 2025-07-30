/* Constants */

const URL_INIT_GETTING_GOODS = '/api/instagram/goods';

const wsConnectionPort = 3004;

let clientId = '';
let goodsHistory = [];

/* JQuery */
const $start = $('#start');
const $link = $('#instagram-link');

const $goods = $('.goods');
const $results = $('.results');

$(async () => {
  initWebsockets(async ({ data }) => {
    const message = JSON.parse(data);

    if (message.event === 'INIT') {
      clientId = message.data;
      return;
    }

    const { goods, isError, isFinished } = message.data;
    goodsHistory.push(...goods);
    
    if (isError) {
      alert('Сталася помилка, завантаженi не всi товари');
    }

    if (goods.length) {
      $results
        .find('.handled span')
        .text(goodsHistory.length);

      appendGoods(goods);
    }

    if (isFinished && goodsHistory.length > 0) {      
      if (goodsHistory.length) {
        return location.href = `/shops/goods?shop_id=${goodsHistory[0].shop_id}`;
      }

      alert('Завершив завантаження');
    }
  });

  $start
    .on('click', async () => {
      const instagramLink = $link.val();

      if (!instagramLink || !instagramLink.includes('instagram.com')) {
        alert('Невалідні дані у полі для вводу instagram-посилання');
        return;
      }

      $goods.empty();
      goodsHistory = [];

      $results
        .removeClass('active')
        .find('.handled span')
        .text(0);

      await initGettingsGods(instagramLink);

      $results.addClass('active');
    });
});

const appendGoods = (goods) => {
  let appendStr = '';

  goods.forEach((g) => {
    const id = g.link;

    const buttonSlides = g.images.map((i, index) => `<button type="button" data-bs-target="#${id}" data-bs-slide-to="${index}"></button>`);
    buttonSlides[0] = `<button class="active" type="button" data-bs-target="#${id}" data-bs-slide-to="0" aria-current="true"></button>`;

    const carouselItems = g.images.map((i) => `<div class="carousel-item"><img class="d-block w-100" src="${i}" alt="${i}" /></div>`);
    carouselItems[0] = `<div class="carousel-item active"><img class="d-block w-100" src="${g.images[0]}" alt="${g.images[0]}" /></div>`;

    appendStr += `<div class="card">
      <div class="carousel slide" id="${id}" data-bs-touch="false" data-bs-interval="false">
        <div class="carousel-indicators">${buttonSlides.join('')}</div>
        <div class="carousel-inner">${carouselItems.join('')}</div>

        <button class="carousel-control-prev" type="button" data-bs-target="#${id}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>

        <button class="carousel-control-next" type="button" data-bs-target="#${id}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>
  
      <div class="card-body">
        <p class="card-text">${g.full_description}</a>
        <a class="btn btn-dark" href="https://www.instagram.com/p/${g.link}" target="_blank">Перейти</a>
      </div>
    </div>`;
  });

  $goods.append(appendStr);
};

const initGettingsGods = async (instagramLink) => {
  return sendPostRequest(URL_INIT_GETTING_GOODS, { instagramLink, clientId });
};

const getWebsocketUrl = () => {
  const isWss = location.protocol === 'https:';  
  return `${isWss ? 'wss' : 'ws'}://${location.hostname}:${wsConnectionPort}`;
};

const initWebsockets = (onMessage) => {
  const wsClient = new WebSocket(getWebsocketUrl());

  wsClient.onmessage = onMessage;

  wsClient.onopen = () => {
    console.log("З'єднання ініційовано");
  };

  wsClient.onclose = event => {
    alert("З'єднання було розірвано, перезавантажте сторінку");
  };
};
