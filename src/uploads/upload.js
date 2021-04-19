const multer = require('multer')
const uploads = multer({dest: __dirname})

module.exports = uploads