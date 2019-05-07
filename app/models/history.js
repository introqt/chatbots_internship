/* eslint-disable arrow-body-style */
const mongoose = require('../../helpers/mongoose');

const historySchema = new mongoose.Schema({
  chatId: Number,
  sku: {
    type: Number,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    lat: Number,
    long: Number,
  },
});

const history = mongoose.model('History', historySchema);

module.exports.history = history;

module.exports.createHistory = (query) => {
  return new Promise((resolve, reject) => {
    history.create(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

module.exports.saveHistory = (query) => {
  return new Promise((resolve, reject) => {
    history.save(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};
