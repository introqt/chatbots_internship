const moment = require('moment');

function buildMenu() {
  return [
    {
      content_type: 'text',
      title: 'My purchases',
      payload: 'My purchases',
    },
    {
      content_type: 'text',
      title: 'Shop',
      payload: 'shop',
    },
    {
      content_type: 'text',
      title: 'My favorites',
      payload: 'My favorites',
    },
    {
      content_type: 'text',
      title: 'Invite a friend',
      payload: 'Invite a friend',
    },
  ];
}

function createProductsGallery(data) {
  const elements = [];
  data.forEach((item) => {
    const content = {
      title: item.name,
      image_url: item.image,
      subtitle: `$${item.salePrice}`,
      buttons:
        [
          {
            type: 'postback',
            title: 'Info',
            payload: `info-${item.sku}`,
          },
          {
            type: 'postback',
            title: 'To favorites',
            payload: `favorite-${item.sku}`,
          },
          {
            type: 'postback',
            title: 'Buy',
            payload: `buy-${item.sku}`,
          },
        ],
    };
    elements.push(content);
  });

  return elements;
}

function showProductInfo(data) {
  return {
    title: data.name,
    image_url: data.image,
    subtitle: data.plot,
    buttons: [
      {
        type: 'postback',
        title: 'Buy',
        payload: `buy-${data.sku}`,
      },
      {
        type: 'postback',
        title: 'Main menu',
        payload: 'main_menu',
      },
    ],
  };
}

function makeMultipleSkuStringFromArray(array) {
  let string = '';
  array.forEach((object) => {
    string += `${object.sku},`;
  });

  return string.slice(0, -1);
}

function createHistoryGallery(data) {
  const elements = [];
  data.forEach((item) => {
    const content = {
      title: item.name,
      image_url: item.image,
      subtitle: `Purchased at ${moment(item.date).format('DD-MM-YYYY')}`,
      buttons: [
        {
          type: 'postback',
          title: 'Repeat',
          payload: `buy-${item.sku}`,
        },
      ],
    };
    elements.push(content);
  });

  return elements;
}

function createFavoritesGallery(data) {
  const elements = [];
  data.forEach((item) => {
    const content = {
      title: item.name,
      image_url: item.image,
      buttons:
        [
          {
            type: 'postback',
            title: 'Buy',
            payload: `buy-${item.sku}`,
          },
        ],
    };
    elements.push(content);
  });

  return elements;
}

module.exports = {
  createProductsGallery,
  buildMenu,
  showProductInfo,
  makeMultipleSkuStringFromArray,
  createFavoritesGallery,
  createHistoryGallery,
};
