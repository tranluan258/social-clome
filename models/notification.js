const mongo = require('mongoose')

const notificationSchema = mongo.Schema({
    id: String,
    user: {
        id: String,
        name: String,
    },
    title: String,
    body: String,
    urlFile: String,
})