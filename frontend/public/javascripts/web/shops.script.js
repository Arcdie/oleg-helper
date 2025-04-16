/* Constants */

const URL_GET_SHOPS = '/api/shops';

/* JQuery */

$(async () => {
  const shops = 


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

  $('.save-excel')
    .on('click', async () => {
      if (!goodsHistory.length) {
        return;
      }

      const preparedData = prepareDataForExcelFile(goodsHistory);
      await createExcelFile(preparedData);
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
  const tableHeaders = ['#', 'Заголовок', 'Опис', 'Ціна', 'Атрибути', 'Повний опис', 'Посилання', 'Зображення'];

  goods.forEach((g, i) => {
    const title = g?.title || '';
    const price = g?.price || '';
    const attributes = g?.attributes || '';
    const description = g?.description || '';

    console.log(g, [
      i + 1,
      title,
      description,
      price,
      attributes,
      g.text,
      `https://www.instagram.com/p/${g.link}`,
      g.images.join(',')
    ]);

    tableBody.push([
      i + 1,
      title,
      description,
      price,
      attributes,
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
