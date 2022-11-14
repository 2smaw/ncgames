const { response } = require('../app')
const db = require('../db/connection')
exports.fetchReviews = () => {
    const queryStr = `SELECT * FROM reviews;`
    return db.query(queryStr).then((response) => {return response.rows})
}

exports.fetchReviewById = (reviewId) => {
    const queryStr = `SELECT * FROM reviews WHERE review_id = $1;`;
    const queryValues = [reviewId];
    return db.query(queryStr, queryValues).then((response) => {return response.rows[0]})
}