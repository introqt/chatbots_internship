/* eslint-disable arrow-body-style */
const findOrCreate = require('mongoose-find-or-create');
const mongoosePaginate = require('mongoose-paginate');
const mongoose = require('../../helpers/mongoose');

const favoritesSchema = new mongoose.Schema({
  chatId: Number,
  sku: {
    type: Number,
  },
  name: String,
  image: String,
  price: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

favoritesSchema.plugin(findOrCreate);
favoritesSchema.plugin(mongoosePaginate);

const favorites = mongoose.model('Favorites', favoritesSchema);

module.exports = favorites;

module.exports.saveFavorites = (query) => {
  return new Promise((resolve, reject) => {
    favorites.create(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

module.exports.findFavorites = (query) => {
  return new Promise((resolve, reject) => {
    favorites.find(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};
