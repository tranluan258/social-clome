const mongoose = require('mongoose')

const accountSchema =  mongoose.Schema({
    id: String,
    email: String,
    password: String,
    type: String
})

const account = mongoose.model('Account',accountSchema)

module.exports = account