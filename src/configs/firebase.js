const admin = require("firebase-admin")
const firebaseConfig = {
    
  }
  
admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    storageBucket: "social-clonne.appspot.com"
})

const bucket = admin.storage().bucket()
const storage = admin.storage()

module.exports = {bucket, storage}
