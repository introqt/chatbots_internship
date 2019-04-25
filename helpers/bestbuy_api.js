const bby = require('bestbuy')(`${process.env.BBY_API_KEY}`);

function getAllCategories() {
  bby.categories({ pageSize: 10 })
    .then((data) => {
      if (data.total === 0) console.log('No categories found');
      else console.log(data);
    })
    .catch((err) => {
      console.warn(err);
    });
}

function getMovies() {
  return bby.products('type=Movie', { show: 'sku,name,salePrice,image' });
}

function getMovieBySku(sku) {
  return bby.products(sku, { show: 'sku,name,salePrice,plot,image' });
}

module.exports = {
  getAllCategories,
  getMovies,
  getMovieBySku,
};
