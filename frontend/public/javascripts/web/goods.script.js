/* Constants */

const URL_CREATE_EXCEL_FILE = '/api/excel';
const URL_UPDATE_SHOP_GOOD = '/api/shops/goods';
const URL_DELETE_SHOP_GOOD = '/api/shops/goods';

/* JQuery */

$(async () => {
  $('table#goods td .full-height').each((i, e) => {
    const parentHeight = $(e).parent().height();
    $(e).height(parentHeight)
  });

  $('table#goods .data').on('keyup', async function() {
    const key = $(this).parent().attr('class');
    const shopGoodId = $(this).closest('tr').attr('id').split('_')[1];

    const resultChange = await updateShopGoodRequest(shopGoodId, {
      [key]: $(this).val(),
    });
  });

  $('table#goods .actions button').on('click', async function() {
    const title = $(this).closest('tr').find('td.title input').val();

    if (confirm(`Підтвердіть видалення товару ${title}`)) {
      const shopGoodId = $(this).closest('tr').attr('id').split('_')[1];

      const resultDelete = await deleteShopGoodRequest(shopGoodId);

      if (resultDelete) {
        $(this).closest('tr').remove();
      }
    }
  });

  $('.save-excel')
    .on('click', async () => {
      const goodsHistory = [];

      $('table#goods tr').each((i, e) => {
        if (i === 0) {
          return;
        }

        const images = [];
        const title = $(e).find('td.title input').val().trim();
        const price = $(e).find('td.price input').val().trim();
        const attributes = $(e).find('td.attributes textarea').val().trim();
        const description = $(e).find('td.description textarea').val().trim();
        const text = $(e).find('td.text p').text().trim();
        const link = $(e).find('a.link').attr('href');

        $(e).find('td.images img').each((i2, i) => {
          images.push($(i).attr('src'));
        });

        goodsHistory.push({
          title, price, attributes, description, text, link,
          images
        });
      });

      if (!goodsHistory.length) {
        return;
      }

      const preparedData = prepareDataForExcelFile(goodsHistory);
      await createExcelFile(preparedData);
    });
});

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

const prepareDataForExcelFile = (goods) => {
  const tableBody = [];
  const tableHeaders = ['#', 'Заголовок', 'Опис', 'Ціна', 'Атрибути', 'Повний опис', 'Посилання', 'Зображення'];

  goods.forEach((g, i) => {
    const title = g.title || '';
    const price = g.price || '';
    const attributes = g.attributes || '';
    const description = g.description || '';

    console.log([
      i + 1,
      title,
      description,
      price,
      attributes,
      g.text,
      g.link,
      g.images.join(',')
    ]);

    tableBody.push([
      i + 1,
      title,
      description,
      price,
      attributes,
      g.text,
      g.link,
      g.images.join(',')
    ]);
  });

  return {
    tableBody,
    tableHeaders,
  };
}

const updateShopGoodRequest = async (shopGoodId, changes) => {
  return sendPutRequest(URL_UPDATE_SHOP_GOOD, { shop_good_id: shopGoodId, changes });
};

const deleteShopGoodRequest = async (shopGoodId) => {
  return sendDeleteRequest(URL_DELETE_SHOP_GOOD, { shop_good_id: shopGoodId });
};
