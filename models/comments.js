const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
    id: String,
    user: {
        id: String,
        email: String,
        name: String,
    },
    idPost: String,
    time: Date,
    data: String,
})

const commentsModel = mongoose.model('comments', commentsSchema)

module.exports = commentsModel