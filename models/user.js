const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    id : String,
    name: String,
    email: String,
    img: String,
    type: String,
})

const userModel = mongoose.model('User',userSchema)

module.exports = userModel