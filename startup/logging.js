const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports.createErrorLogger = function (dbPath) {
  const logger = winston.createLogger({
    transports: [
      //new winston.transports.Console(),
      new winston.transports.File({ filename: "./logs/combined.log", level: "info" }),
      new winston.transports.MongoDB({ db: dbPath, level: "error" }),
      new winston.transports.File({
        filename: "./logs/exceptionErrors.log",
        level: "error",
        handleExceptions: true,
        handleRejections: true,
      }),
    ],
  });

  // Senkron kod akış hatalarını yakala
  process.on("uncaughtException", (ex) => {
    //console.log("WE GOT AN UNCAUGHT EXCEPTION");
    logger.error(ex.message, { metadata: ex }); // kurstakinden farklı yazmak zorunda kaldık...
    // kursta process göçmüyor demiş ama burada göçüyor...
    //process.exit(1); //yukarıdaki işlem bitmeden uygulama sonlandırıldığı için log tutmuyor !!!
  });

  // Asenkron kod akış hatalarını yakala
  process.on("unhandledRejection", (ex) => {
    //console.log("WE GOT AN UNHANDLED REJECTION");
    logger.error(ex.message, { metadata: ex }); // kurstakinden farklı yazmak zorunda kaldık...
    //process.exit(1); //yukarıdaki işlem bitmeden uygulama sonlandırıldığı için log tutmuyor !!!

    // burada oluşan hatayı fırlatsak bu hata rejection formatından exception formatına değişir
    // ve bunu yakalayan bir kod parçası varsa orada log'lanabilir.
    // throw ex;
  });

  module.exports.logger = logger;
};
