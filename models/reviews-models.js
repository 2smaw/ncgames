const { response } = require('../app')
const db = require('../db/connection')
exports.fetchReviews = () => {
    const queryStr = `SELECT * FROM reviews ORDER BY created_at DESC;`
    return db.query(queryStr).then((response) => {return response.rows})
}

exports.fetchReviewById = (reviewId) => {
    const queryStr = `SELECT * FROM reviews WHERE review_id = $1;`;
    const queryValues = [reviewId];
    return db.query(queryStr, queryValues).then((response) => {
        if (Object.keys(response.rows[0]).length === 0){
            return Promise.reject({status: 404, msg: `no such review!`});
        };
        return response.rows[0];
    })
}

exports.fetchComments = (reviewId) => {
    const queryStr = `
        SELECT * FROM comments WHERE review_id = $1
        ORDER BY created_at DESC;
        `;
    const queryValues = [reviewId];
    return db.query(queryStr, queryValues).then((response) => {
        if (response.rows.length === 0){
            return Promise.reject({status: 404, msg: `no such review!`});
        } else return response.rows;
    })
}

