const {
    fetchCategories
} = require('../models/categories-models');

exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        res.send({categories})
    }).catch(next)
}