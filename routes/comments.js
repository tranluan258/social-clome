const express = require('express')
const router = express.Router()
const userModel = require('../models/user')
const accountModel = require('../models/accounts')
const postModel = require('../models/posts')
const commentsModel = require('../models/comments')
const uuid = require('short-uuid')

router.post('/add', (req, res) => {
    const { idPost, email, data } = req.body
    if (!idPost || !email || !data) {
      res.json({ code: 1, message: "Du lieu khong hop le" })
    }
    new commentsModel({
      id: uuid.generate(),
      email: email,
      idPost: idPost,
      time: new Date().getTime(),
      data: data,
    }).save()
      .then(() => res.json({ code: 0, message: "Thanh cong" }))
      .catch((err) => res.json({ code: 2, message: "Xay ra loi" }))
})

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id
    commentsModel.deleteOne({id: id})
    .then(() => res.json({ code: 0 , message: "Xoa thanh cong"}))
    .catch((err) => res.json({ code: 1, message: "Xoa that bai"}))
})

router.put('/update', (req, res) => {
    const {id,data} = req.body
    commentsModel.findOneAndUpdate(
        {
            id: id,
        },
        {
            data: data,
            time: new Date().getTime(),
        },
        {
            new: true,
        }
    )
    .then(() => res.json({ code: 0 , message: "Sua thanh cong"}))
    .catch((err) => res.json({ code: 1, message: "Sua that bai" }))
})

module.exports = router