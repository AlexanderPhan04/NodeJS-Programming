const mongoose = require("mongoose");
const { MONGODB_DB_NAME, MONGODB_URI } = require("./env");

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(MONGODB_URI, {
    dbName: MONGODB_DB_NAME,
  });

  return mongoose.connection;
}

module.exports = {
  connectDatabase,
};
