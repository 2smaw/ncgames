const db = require('../db/connection');

exports.removeComment = (commentId) => {
    const queryStr = 'DELETE FROM comments WHERE comment_id=$1 RETURNING *';
    const queryValues = [commentId];
    return db.query(queryStr, queryValues).then((response) => {
        if (response.rows.length===0) {
            return Promise.reject({status: 400, msg: `there\'s no such comment`})
        }
    })
}