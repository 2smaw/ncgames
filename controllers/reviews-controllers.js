const {
    fetchReviews,
    fetchReviewById,
    fetchComments,
    insertComment
} = require('../models/reviews-models');

exports.getReviews = (req, res, next) => {
    fetchReviews().then((reviews) => {
        res.send({reviews})
    })
}

exports.getReviewById = (req, res, next) => {
    fetchReviewById(req.params.review_id).then((review) => {
        res.send({review})
    }).catch(next)
}

exports.getComments = (req, res, next) => {
    fetchComments(req.params.review_id).then((comments) => {
        res.send({comments})
    }).catch(next)
}

exports.postComment = (req, res, next) => {
    insertComment(req.params.review_id, req.body).then((newComment) => {
        console.log(newComment);
        res.status(201).send(newComment)
    }).catch(next)
}