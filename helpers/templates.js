function createProductsGallery(data) {
  const elements = [];
  data.forEach((item) => {
    const content = {
      title: item.name,
      image_url: item.image,
      // subtitle: item.plot,
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
      payload: 'Shop',
    },
    {
      content_type: 'text',
      title: 'Favorites',
      payload: 'Favorites',
    },
    {
      content_type: 'text',
      title: 'Invite a friend',
      payload: 'Invite a friend',
    },
  ];
}

module.exports = {
  createProductsGallery,
  buildMenu,
};
