const mongoose = require('mongoose')

const commentsSchema = mongoose.Schema({
    id: String,
    email: String,
    idPost: String,
    time: Date,
    body: String,
})

const commentsModel = mongoose.model('comments', commentsSchema)

module.exports = commentsModel