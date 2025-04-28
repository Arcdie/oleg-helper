/* Constants */

const URL_UPDATE_SHOP = '/api/shops';
const URL_DELETE_SHOP = '/api/shops';

/* JQuery */

$(async () => {
  $('table#shops .data').on('keyup', async function() {
    const key = $(this).parent().attr('class');
    const shopId = $(this).closest('tr').attr('id').split('_')[1];

    const resultChange = await updateShopRequest(shopId, {
      [key]: $(this).val(),
    });
  });

  $('table#shops .actions button').on('click', async function() {
    const name = $(this).closest('tr').find('td.name input').val();

    if (confirm(`Підтвердіть видалення магазину ${name}`)) {
      const shopId = $(this).closest('tr').attr('id').split('_')[1];

      const resultDelete = await deleteShopRequest(shopId);

      if (resultDelete) {
        $(this).closest('tr').remove();
      }
    }
  });
});

const updateShopRequest = async (shopId, changes) => {
  return sendPutRequest(URL_UPDATE_SHOP, { shop_id: shopId, changes });
};

const deleteShopRequest = async (shopId) => {
  return sendDeleteRequest(URL_DELETE_SHOP, { shop_id: shopId });
};
