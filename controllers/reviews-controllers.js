const {
    fetchReviews,
    fetchReviewById
} = require('../models/reviews-models');

exports.getReviews = (req, res, next) => {
    fetchReviews().then((reviews) => {
        res.send({reviews})
    })
}

