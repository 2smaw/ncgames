const { response } = require('../app');
const { query } = require('../db/connection');
const db = require('../db/connection');
const { checkReviewHasComments } = require('../db/seeds/utils');

exports.fetchReviews = ({category=null, sort_by='created_at', order='ASC'}) => {
    const validSorts = ['title', 'designer', 'owner', 'category', 'created_at', 'votes'];
    const validOrders = ['DESC', 'ASC'];

    let queryStr = `SELECT title, designer, owner, reviews.review_id, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comments.body)::INT AS comment_count
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id=comments.review_id`
    let queryValues = [];
    
    // query - category
    if (category) {
        queryStr += ` WHERE reviews.category = $1`;
        queryValues.push(category);
    }
    queryStr += ` GROUP BY reviews.review_id
        ORDER BY reviews.${sort_by} ${order};`

    // no errors return
    if (validSorts.includes(sort_by) & validOrders.includes(order.toUpperCase())) {
        return db.query(queryStr, queryValues).then((response) => {
            return response.rows})
        } else {
            return Promise.reject({status: 400, msg: `invalid sort request`})
        }
}

exports.fetchReviewById = (reviewId) => {
    const queryStr = `
        SELECT reviews.*, count(comments.comment_id)::INT AS comment_count
        FROM reviews
        LEFT JOIN comments
        ON reviews.review_id=comments.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;`;
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
    // check if review exists
    return db.query(`SELECT * FROM reviews WHERE review_id=$1`, [reviewId]).then((review) => {
        if (review.rows.length===0) {return Promise.reject({status: 404, msg: `no such review!`})}
        // check if review has comments
        else {return db.query('SELECT * FROM comments WHERE review_id=$1', [reviewId]).then((comments) => {
            if (comments.rows.length===0) {return comments.rows}
            // no error condition
            else {return db.query(queryStr, queryValues).then((response) => {
                return response.rows;})}
        })}
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
