/* eslint-disable arrow-body-style */
const findOrCreate = require('mongoose-find-or-create');
const mongoose = require('../../helpers/mongoose');

const favoritesSchema = new mongoose.Schema({
  chatId: Number,
  sku: {
    type: Number,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

favoritesSchema.plugin(findOrCreate);

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
