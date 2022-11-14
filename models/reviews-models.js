const { response } = require('../app')
const db = require('../db/connection')
exports.fetchReviews = () => {
    const queryStr = `SELECT * FROM reviews;`
    return db.query(queryStr).then((response) => {return response.rows})
}
