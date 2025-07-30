/* Constants */

const URL_UPDATE_SHOP = '/api/shops';
const URL_DELETE_SHOP = '/api/shops';

/* JQuery */

$(async () => {
  $('table#shops .data').on('blur', async function() {
    const key = $(this).parent().attr('class');
    const shopId = $(this).closest('tr').attr('id').split('_')[1];

    try {
      const resultChange = await updateShopRequest(shopId, {
        [key]: $(this).val(),
      });

      if (resultChange) {
        addAlert('success', 'Запис оновлено');
      }
    } catch (err) {
      addAlert('error', 'Не вдалося оновити запис');
    }
  });

  $('table#shops .actions button').on('click', async function() {
    const name = $(this).closest('tr').find('td.name input').val();

    if (confirm(`Підтвердіть видалення магазину ${name}`)) {
      const shopId = $(this).closest('tr').attr('id').split('_')[1];

      try {
        const resultDelete = await deleteShopRequest(shopId);

        if (resultDelete) {
          $(this).closest('tr').remove();
          addAlert('success', 'Запис видалено');
        }
      } catch (err) {
        addAlert('error', 'Не вдалося видалити запис');
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
