const mongoose = require("mongoose");
const { logger } = require("./logging");

module.exports.connectDatabase = function (dbPath) {
  mongoose.connect(dbPath).then(() => {
    logger.info("Successfully connected to the database");
  });
};
// exception oluşursa hata yakalama kodu çalışacağı için .catch() kısmını kaldırdık
