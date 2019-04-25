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
            payload: 'info',
          },
          {
            type: 'postback',
            title: 'To favorites',
            payload: 'favorite',
          },
          {
            type: 'postback',
            title: 'Buy',
            payload: 'buy',
          },
        ],
    };
    elements.push(content);
  });

  return elements;
}

module.exports = {
  createProductsGallery,
};
