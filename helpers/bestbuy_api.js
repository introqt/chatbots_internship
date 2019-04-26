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

function getMovies(page = 1) {
  return bby.products('type=Movie', { show: 'sku,name,salePrice,image', page });
}

function getMovieBySku(sku) {
  return bby.products(`(search=${sku})`, { show: 'sku,name,salePrice,plot,image', pageSize: 1 });
}

module.exports = {
  getAllCategories,
  getMovies,
  getMovieBySku,
};
