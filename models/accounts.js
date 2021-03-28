const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String,
    img: String,
    type: String
})

const account = mongoose.model('Account',accountSchema)

module.exports = account