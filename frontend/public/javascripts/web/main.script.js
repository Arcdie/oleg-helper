/* Constants */

const URL_CREATE_EXCEL_FILE = '/api/excel';
const URL_GET_GOODS = '/api/instagram/goods';

/* JQuery */
const $start = $('#start');
const $link = $('#instagram-link');

const $goods = $('.goods');
const $results = $('.results');

$(async () => {
  $start
    .on('click', async () => {
      const instagramLink = $link.val();

      if (!instagramLink || !instagramLink.includes('instagram.com')) {
        alert('Невалідні дані у полі для вводу instagram-посилання');
        return;
      }

      $results
        .removeClass('active')
        .find('.handled span')
        .text(0);

      const result = await getGoods(instagramLink);
      const { goods, isFinished } = result;
      
      if (!isFinished) {
        alert('Сталася помилка, завантаженi не всi товари');
      }

      $results
        .addClass('active')
        .find('.handled span')
        .text(goods.length);

      appendGoods(goods);

      const preparedData = prepareDataForExcelFile(goods);
      await createExcelFile(preparedData);
    });
});

const appendGoods = (goods) => {
  let appendStr = '';

  goods.forEach((g) => {
    appendStr += `<div class="card"><img class="card-img-top" src="${g.images[0]}" alt="good" />
      <div class="card-body">
        <p class="card-text">${g.text}</a>
        <a class="btn btn-dark" href="https://www.instagram.com/p/${g.link}" target="_blank">Перейти</a>
      </div>
    </div>`;
  });

  $goods.empty().append(appendStr);
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

const getGoods = async (instagramLink) => {
  return sendPostRequest(URL_GET_GOODS, { instagramLink });
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