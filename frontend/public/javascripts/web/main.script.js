/* Constants */

const URL_CREATE_EXCEL_FILE = '/api/excel';
const URL_INIT_GETTING_GOODS = '/api/instagram/goods';

const wsConnectionPort = 3002;

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
      alert('Завершив завантаження');
      const preparedData = prepareDataForExcelFile(goodsHistory);
      await createExcelFile(preparedData);
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
        <p class="card-text">${g.text}</a>
        <a class="btn btn-dark" href="https://www.instagram.com/p/${g.link}" target="_blank">Перейти</a>
      </div>
    </div>`;
  });

  $goods.append(appendStr);
};

const prepareDataForExcelFile = (goods) => {
  const tableBody = [];
  const tableHeaders = ['#', 'Опис', 'Посилання', 'Зображення'];

  goods.forEach((g, i) => {
    tableBody.push([
      i + 1,
      g.text,
      `https://www.instagram.com/p/${g.link}`,
      g.images.join(',')
    ]);
  });

  return {
    tableBody,
    tableHeaders,
  };
}

const initGettingsGods = async (instagramLink) => {
  return sendPostRequest(URL_INIT_GETTING_GOODS, { instagramLink, clientId });
};

const createExcelFile = async ({ tableHeaders, tableBody }) => {
  const response = await fetch(URL_CREATE_EXCEL_FILE, {
    method: 'POST',
    body: JSON.stringify({
      tableBody,
      tableHeaders,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    alert('CANT_CREATE_EXCEL_FILE');
  }

  const blob = await response.blob();

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'output.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
};

const initWebsockets = (onMessage) => {
  const wsClient = new WebSocket(`ws://45.95.234.5:${wsConnectionPort}`);

  wsClient.onmessage = onMessage;

  wsClient.onopen = () => {
    console.log("З'єднання ініційовано");
  };

  wsClient.onclose = event => {
    alert("З'єднання було розірвано, перезавантажте сторінку");
  };
};
