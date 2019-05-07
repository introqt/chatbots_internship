/* eslint-disable arrow-body-style */
const mongoosePaginate = require('mongoose-paginate');
const mongoose = require('../../helpers/mongoose');

const historySchema = new mongoose.Schema({
  chatId: {
    type: Number,
    required: true,
  },
  sku: {
    type: Number,
    required: true,
  },
  name: String,
  image: String,
  price: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    lat: Number,
    long: Number,
  },
});

historySchema.plugin(mongoosePaginate);

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

module.exports.findHistory = (query) => {
  return new Promise((resolve, reject) => {
    history.find(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};
