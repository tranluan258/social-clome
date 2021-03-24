const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema({
    id: String,
    idFaculty: String,
    email: String,
    time: Date,
    title: String,
    data: String,
    urlFile: String,
})

const notificationsModel = mongoose.model('notification', notificationSchema)

module.exports = notificationsModel