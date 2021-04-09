const multer = require("multer");
const upload = multer({ dest: __dirname });

module.exports = upload