const endpoints = require("../db/endpoints");

exports.getEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};