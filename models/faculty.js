const mongoose = require('mongoose')

const facultySchema = mongoose.Schema({
    id: String,
    name : String,
})

const facultyModel = mongoose.model('faculty', facultySchema)

module.exports = facultyModel