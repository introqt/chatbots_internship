/* eslint-disable arrow-body-style */
const findOrCreate = require('mongoose-find-or-create');
const mongoose = require('../../helpers/mongoose');

const userSchema = new mongoose.Schema({
  chatId: {
    type: Number,
    required: true,
  },
  fullName: String,
  phone: String,
  referrals: [{
    chatId: Number,
    dateActivated: {
      type: Date,
      default: Date.now,
    },
  }],
  gifts: {
    type: Number,
    default: 0,
  },
});

userSchema.plugin(findOrCreate);

const user = mongoose.model('User', userSchema);

module.exports = user;

module.exports.findOrCreateUser = (query) => {
  return new Promise((resolve, reject) => {
    user.findOrCreate(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

module.exports.findUser = (query) => {
  return new Promise((resolve, reject) => {
    user.findOne(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};
