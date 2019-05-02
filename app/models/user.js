const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  chatId: Number,
  favorites: [
    {
      sku: Number,
      name: String,
    },
  ],
  history: [
    {
      sku: Number,
      name: String,
      date: Date,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
