const User = require('../models/User');

const findByEmail = (email) => User.findOne({ email }).select('+password');

const findById = (id) => User.findById(id);

const create = (data) => User.create(data);

module.exports = { findByEmail, findById, create };
