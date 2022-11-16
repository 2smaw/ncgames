const { response } = require('../app');
const db = require('../db/connection');

exports.fetchReviews = () => {
    const queryStr = `SELECT title, designer, owner, review_id, review_img_url, category, created_at, votes FROM reviews ORDER BY created_at DESC;`
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

exports.insertComment = (reviewId, newComment) => {
    if (!newComment.body) {return Promise.reject({status: 400, msg: `missing body`})};
    if (!newComment.username) {return Promise.reject({status: 400, msg: `missing username`})};
    const queryStr = `
        INSERT INTO comments
        (body, author, review_id)
        VALUES
        ($1, $2, $3)
        RETURNING *;
        `;
    const queryValues = [newComment.body, newComment.username, reviewId];
    return db.query(queryStr, queryValues).then((response) => {
        return response.rows[0];
    }).catch((err) => {
        if (err.code==='23503') {
            return Promise.reject({status: 404, msg: `no such review!`})}
        else if (err.code === '22P02') {
            return Promise.reject({status: 400, msg: 'baaad request x'});
        }
    })
}

exports.updateReviewVote = (reviewId, changeVoteCount) => {
    const queryStr = `
        UPDATE reviews
        SET votes=votes+$1
        WHERE review_id=$2
        RETURNING *;`;
    const queryValues = [changeVoteCount, reviewId];
    return db.query(queryStr, queryValues).then((response) => {
        if (response.rows[0].votes>=0) {return response.rows[0];}
        else {return Promise.reject({status: 400, msg: `there weren/'t that many votes to start with...`})}
    })
}
