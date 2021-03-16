const mongo = require('mongoose')

const postSchema = mongo.Schema({
    user: {
        id: String,
        name: String,
    },
    title: String,
    body: String,
    time: Date,
    urlImg: String,
    idVideos: String
})