const {fetchUsers} = require('../models/users-models');
exports.getUsers = (req, res, next) => {
    fetchUsers().then((response) => {
        res.send(response);
    });
};