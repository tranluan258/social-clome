const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    id: String,
    email: String,
    password: String,
    type: String
})

const account = mongoose.model('Account',accountSchema)

module.exports = account