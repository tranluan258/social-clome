const mongoose = require('mongoose')
const connectionString = process.env.MONGO_URI || "mongodb://localhost:27017/SocialClone"

if(!connectionString){
    console.log('No connection string')
    process.exit(1)
}
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false })
const db = mongoose.connection

db.on('error', error => {
    console.log("Error")
    process.exit(1)
})

db.once('open', () => {console.log("Open connection")})


module.exports = db