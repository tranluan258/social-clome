const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: __dirname + '/uploads/' })
const userModel = require('../models/user')
const accountModel = require('../models/accounts')
const postModel = require('../models/posts')
const fs = require('fs')
const uuid = require('short-uuid')
const validator = require('youtube-validator')

router.post('/upload', upload.single('attachment'), async (req, res) => {
  const { email, path, YoutubeId, data } = req.body
  const file = req.file
  if (!email || !data) {
    res.json({ code: 1, message: 'Du lieu khong hop le' })
  }

  const user = await accountModel.findOne({ email: email}) || userModel.findOne({ email: email })

  if(user){
    if (file) {
      const { root } = req.vars
      const currentPath = `${root}/users/${email}/${path}`
  
      if (!fs.existsSync(currentPath)) {
        res.json({ code: 2, message: "Duong dan hong hop le" })
      }
  
      let name = file.originalname
      let newPath = currentPath + "/" + name
      fs.renameSync(file.path, newPath)
  
      new postModel({
        id: uuid.generate(),
        email: email,
        data: data,
        time: new Date().getTime(),
        urlFile: newPath,
        idVideos: ""
      }).save()
        .then(() => res.json({ code: 0, message: "Them thanh cong" }))
        .catch(() => res.json({ code: 3, message: "Them that bai" }))
    }
  
    if (YoutubeId != "") {
      validator.validateVideoID(YoutubeId, (result,err) => {
        if(err){
  
        }else{
          new postModel({
            id: uuid.generate(),
            email: email,
            data: data,
            time: new Date().getTime(),
            urlFile: "",
            idVideos: YoutubeId
          }).save()
          .then(() => res.json({ code: 0, message: "Them thanh cong" }))
          .catch(() => res.json({ code: 3, message: "Them that bai" }))
        }
      })
    }
  }
})

module.exports = router