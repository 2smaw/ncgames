const express = require('express');
require("jest-sorted");
const app = express();
const {getCategories} = require('./controllers/categories-controllers');
const {getReviews, getReviewById} = require('./controllers/reviews-controllers')

app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewById);

// error handling

// internal server errors
app.use((err, req, res, next) => {
    console.log('caught error: ', err);
    res.status(500).send('Internal server error')
})

module.exports = app;