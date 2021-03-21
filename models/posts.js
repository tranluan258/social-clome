const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    id: String,
    email: String,
    data: String,
    time: Date,
    urlFile: String,
    idVideos: String
})

const postModel = mongoose.model('post', postSchema)

module.exports = postModel