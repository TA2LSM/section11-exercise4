const express = require("express");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function (app) {
  const error = require("../middleware/error")(app.logger);

  // Aşağıdaki tanımlamalar MIDDLEWARE fonksiyonlarıdır...
  app.use(express.json());
  app.use("/api/genres", genres); //ilgili istekleri genres router'ına yönlendirir
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  // Error handling middleware fonksiyonu
  app.use(error); // fonksiyonu referans geçiyoruz çağırmıyoruz ( error() değil !!! )
};
