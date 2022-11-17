const endpoints = require("../db/data/endpoints");

exports.getEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};