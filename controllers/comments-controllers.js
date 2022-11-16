const {removeComment} = require('../models/comments-models');

exports.deleteComment = (req, res, next) => {
    removeComment(req.params.comment_id).then(() => {
        res.status(204).end()
    }).catch(next)
}