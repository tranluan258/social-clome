const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema({
    id: String,
    email: String,
    title: String,
    body: String,
    urlFile: String,
})

const notificationsModel = mongoose.model('notification', notificationSchema)

module.exports = notificationsModel