const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    id: String,
    user: {
        id: String,
        email: String,
        name: String,
        img: String,
    },
    data: String,
    time: Date,
    urlFile: String,
    nameFile: String,
    idVideos: String
})

const postModel = mongoose.model('post', postSchema)

module.exports = postModel