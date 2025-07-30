/* Constants */

const URL_CREATE_EXCEL_FILE = '/api/excel';
const URL_GET_SHOP_GOODS = '/api/shops/goods';
const URL_UPDATE_SHOP_GOODS = '/api/shops/goods';
const URL_DELETE_SHOP_GOOD = '/api/shops/goods';

/* JQuery */

$(async () => {
  $('#save button')
    .on('click', async () => {
      const $items = $('.table-goods .table-body .item');

      const data = [];

      $items.each((i, item) => {
        const $item = $(item);
        const id = $item.attr('id').split('_')[1];

        const $columns = $item.find('.column');

        const uniqueId = $columns.eq(0).find('textarea').val();
        const title = $columns.eq(1).find('textarea').val();
        const shortDescription = $columns.eq(2).find('textarea').val();
        const fullDescription = $columns.eq(3).find('textarea').val();
        const price = $columns.eq(4).find('textarea').val();
        const categories = $columns.eq(5).find('textarea').val();
        const colors = $columns.eq(6).find('textarea').val();
        const sizes = $columns.eq(7).find('textarea').val();

        const attributes = {};
        const attributesColumns = $columns.eq(8).find('.input-group');

        attributesColumns.each((i2, attribute) => {
          const $attribute = $(attribute);

          const key = $attribute.find('span').text();
          const name = $attribute.find('input.name').val();
          const value = $attribute.find('input.value').val();

          if (name && value) {
            attributes[key] = [name, value];
          }
        });
        

        data.push({
          _id: id,
          unique_id: uniqueId,
          title,
          short_description: shortDescription,
          full_description: fullDescription,
          price,
          categories: categories !== '' ? categories.split(',').map(e => e.trim()) : [],
          colors: colors !== '' ? colors.split(',').map(e => e.trim()) : [],
          sizes: sizes !== '' ? sizes.split(',').map(e => e.trim()) : [],
          attributes,
        });
      });

      try {
        const resultChange = await updateShopGoodsRequest(data); 

        if (resultChange) {
          addAlert('success', 'Данi оновлено');
        }
      } catch (err) {
        addAlert('error', 'Не вдалося оновити данi');
      }
    });

  $('.table-goods .actions button').on('click', async function() {
    const $item = $(this).closest('.item');

    const title = $item.find('.title textarea').val();

    if (confirm(`Підтвердіть видалення товару ${title}`)) {
      const shopGoodId = $item.attr('id').split('_')[1];

      try {
        const resultDelete = await deleteShopGoodRequest(shopGoodId);

        if (resultDelete) {
          $item.remove();
          addAlert('success', 'Запис видалено');
        }
      } catch (err) {
        addAlert('error', 'Не вдалося видалити запис');
      }
    }
  });

  $('.save-excel')
    .on('click', async () => {
      const shopId = new URL(window.location.href).searchParams.get('shop_id');
      const goods = await getShopGoodsRequest(shopId);

      const tableBody = [];
      const tableHeaders = ['#', 'ProductTitle', 'ShortDescription', 'Price', 'FullDescr', 'Link', 'Images', 'Category', 'Attribute Name (pa_color)', 'Attribute Value (pa_color)', 'Attribute Name (pa_size)', 'Attribute Value (pa_size)', 'Attribute Name (custom_1)', 'Attribute Value (custom_1)', 'Attribute Name (custom_2)', 'Attribute Value (custom_2)', 'Attribute Name (custom_3)', 'Attribute Value (custom_3)', 'Attribute Name (custom_4)', 'Attribute Value (custom_4)', 'Attribute Name (custom_5)', 'Attribute Value (custom_5)'];

      goods.forEach((g, i) => {
        tableBody.push([
          g.unique_id,
          g.title,
          g.short_description,
          g.price,
          g.full_description,
          g.link,
          g.images.join(','),
          g.categories.join(','),
          g.colors.length ? 'Колір' : '',
          g.colors.length ? g.colors.join('|') : '',
          g.sizes.length ? 'Розмір' : '',
          g.sizes.length ? g.sizes.join('|') : '',

          g.attributes['custom_1'].length ? g.attributes['custom_1'][0] : '',
          g.attributes['custom_1'].length ? g.attributes['custom_1'][1] : '',

          g.attributes['custom_2'].length ? g.attributes['custom_2'][0] : '',
          g.attributes['custom_2'].length ? g.attributes['custom_2'][1] : '',

          g.attributes['custom_3'].length ? g.attributes['custom_3'][0] : '',
          g.attributes['custom_3'].length ? g.attributes['custom_3'][1] : '',

          g.attributes['custom_4'].length ? g.attributes['custom_4'][0] : '',
          g.attributes['custom_4'].length ? g.attributes['custom_4'][1] : '',

          g.attributes['custom_5'].length ? g.attributes['custom_5'][0] : '',
          g.attributes['custom_5'].length ? g.attributes['custom_5'][1] : '',
        ]);
      });

      await createExcelFile({
        tableBody,
        tableHeaders,
      });
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

const getShopGoodsRequest = async (shopId) => {
  return sendGetRequest(URL_GET_SHOP_GOODS, { shop_id: shopId });
};

const updateShopGoodsRequest = async (changes) => {
  return sendPutRequest(URL_UPDATE_SHOP_GOODS, { changes });
};

const deleteShopGoodRequest = async (shopGoodId) => {
  return sendDeleteRequest(URL_DELETE_SHOP_GOOD, { shop_good_id: shopGoodId });
};
