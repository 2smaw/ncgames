const {
    fetchReviews,
    fetchReviewById
} = require('../models/reviews-models');

exports.getReviews = (req, res, next) => {
    fetchReviews().then((reviews) => {
        res.send({reviews})
    })
}

exports.getReviewById = (req, res, next) => {
    fetchReviewById(req.params.review_id).then((review) => {
        res.send({review})
    })
}
