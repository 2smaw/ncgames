const express = require('express');
const app = express();
const {getCategories} = require('./controllers/categories-controllers');
const {getReviews, getReviewById, getComments, postComment, patchReviewVote} = require('./controllers/reviews-controllers')

app.use(express.json());

// get requests
app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewById);
app.get('/api/reviews/:review_id/comments', getComments);

// post requests
app.post('/api/reviews/:review_id/comments', postComment);

// patch requests
app.patch('/api/reviews/:review_id', patchReviewVote);

// error handling

// psql errors
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send('baaad request x');
    } else {
        next(err);
    }
})
// custom errors
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg});
    } else {
        next(err);
    }
})

// internal server errors
app.use((err, req, res, next) => {
    console.log('caught error: ', err);
    res.status(500).send('internal server error')
})

module.exports = app;