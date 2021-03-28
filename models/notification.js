const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    id: String,
    faculty: {
        idFaculty: String,
        name: String,
    },
    user: {
        id: String,
        email: String,
        name: String
    },
    time: Date,
    title: String,
    data: String,
    urlFile: String,
})

const notificationsModel = mongoose.model('notification', notificationSchema)

module.exports = notificationsModel