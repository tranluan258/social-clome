const mongo = require('mongoose')

const commentsSchema = mongo.Schema({
    id: String,
    user:{
        id: String,
        name: String,
    },
    idPost: String,
    time: Date,
    body: String,
})

const commentsModel = mongo.model('comments', commentsSchema)

module.exports = commentsModel