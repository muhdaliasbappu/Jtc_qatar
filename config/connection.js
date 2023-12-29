const { MongoClient } = require("mongodb");

const state = {
  db: null,
};

const url = "mongodb://127.0.0.1:27017";

const client = new MongoClient(url);

const connect = async (dbName, cb) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    state.db = db;
    // Check if cb is a function before calling it
    if (typeof cb === 'function') {
      return cb();
    } else {
      console.error('Callback is not a function');
    }
  } catch (err) {
    // Check if cb is a function before calling it with the error
    if (typeof cb === 'function') {
      return cb(err);
    } else {
      console.error('Callback is not a function');
    }
  }
};

const get = () => state.db;

module.exports = {
  connect,
  get,
};

