const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    googleId : String,
    name: String,
    email: String,
    img: String,
    type: String,
});
const userModel = mongoose.model('User',userSchema);
module.exports = userModel;