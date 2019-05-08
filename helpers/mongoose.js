const mongoose = require('mongoose');

mongoose.connect(`${process.env.MONGO_URI}`, {
  reconnectTries: 100,
  reconnectInterval: 500,
  autoReconnect: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  // ssl: true,
  // dbName: 'test',
}).catch(err => console.log('Mongo connection error', err));

module.exports = mongoose;
