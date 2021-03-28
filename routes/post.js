const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: __dirname + '/uploads/' })
const userModel = require('../models/user')
const accountModel = require('../models/accounts')
const postModel = require('../models/posts')
const commentsModel = require('../models/comments')
const fs = require('fs')
const uuid = require('short-uuid')
const validator = require('youtube-validator')

router.post('/add', upload.single('attachment'), async (req, res) => {
  const { email, YoutubeId, data } = req.body
  const file = req.file
  if (!email || !data) {
    res.json({ code: 1, message: 'Du lieu khong hop le' })
  }

  const user = await accountModel.findOne({ email: email }) || userModel.findOne({ email: email })

  if (user) {
    if (file) {
      const { root } = req.vars
      const currentPath = `${root}/users/${email}`

      if (!fs.existsSync(currentPath)) {
        res.json({ code: 2, message: "Duong dan hong hop le" })
      }

      let name = file.originalname
      let newPath = currentPath + "/" + name
      fs.renameSync(file.path, newPath)
      new postModel({
        id: uuid.generate(),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        data: data,
        time: new Date().getTime(),
        urlFile: newPath,
        nameFile: name,
        idVideos: ""
      }).save()
        .then(() => res.json({ code: 0, message: "Them thanh cong" }))
        .catch(() => res.json({ code: 3, message: "Them that bai" }))
    } else if (YoutubeId != "") {
      validator.validateVideoID(YoutubeId, (result, err) => {
        if (err) {
          res.json({ code: 1, message: "Du lieu khong hop le" })
        } else {
          new postModel({
            id: uuid.generate(),
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
            },
            data: data,
            time: new Date().getTime(),
            urlFile: "",
            idVideos: YoutubeId
          }).save()
            .then(() => res.json({ code: 0, message: "Them thanh cong" }))
            .catch(() => res.json({ code: 3, message: "Them that bai" }))
        }
      })
    } else {
      new postModel({
        id: uuid.generate(),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        data: data,
        time: new Date().getTime(),
        urlFile: "",
        idVideos: ""
      }).save()
        .then(() => res.json({ code: 0, message: "Them thanh cong" }))
        .catch(() => res.json({ code: 3, message: "Them that bai" }))
    }

  }
})

router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id
  const post = await postModel.findOne({id : id})
  if(post){
    postModel.deleteOne({ id: id })
    .then(() => {
      commentsModel.deleteMany({ idPost: id })
        .then(() =>{
          if(fs.existsSync(post.urlFile)){
            fs.unlinkSync(post.urlFile)
          }
          res.json({ code: 0, message: "Xoa thanh cong" })
        })
    }).catch(() => res.json({ code: 1, message: "Xoa that bai" }))
    .catch((err) => res.json({ code: 1, message: "Xoa that bai" }))
  }
})

router.post('/update',(req, res) => {
  
})

module.exports = router