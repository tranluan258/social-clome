const mongo = require('mongoose')

const facultySchema = mongo.Schema({
    id: String,
    name : String,
})

const facultyModel = mongo.model('faculty', facultySchema)

module.exports = facultyModel