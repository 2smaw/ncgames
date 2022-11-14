const express = require('express');
const app = express();
const {getCategories} = require('./controllers/categories-controllers');

app.use(express.json());

app.get('/api/categories', getCategories);

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
    res.status(500).send('Internal server error')
})

module.exports = app;