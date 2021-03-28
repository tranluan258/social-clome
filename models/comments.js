const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
    id: String,
    email: String,
    idPost: String,
    time: Date,
    data: String,
})

const commentsModel = mongoose.model('comments', commentsSchema)

module.exports = commentsModel