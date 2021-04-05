const express = require('express')
const router = express.Router()
const accountModel = require('../models/accounts')
const postModel = require('../models/posts')
const commentsModel = require('../models/comments')
const validatorLogin = require('../middleware/validatorLogin')
const uuid = require('short-uuid')

router.post('/add', validatorLogin, async (req, res) => {
    const { idPost, email, data } = req.body
    if (!idPost || !email || !data) {
      res.json({ code: 1, message: "Du lieu khong hop le" })
    }
    const user = await accountModel.findOne({ email: email })
    if(user){
      new commentsModel({
        id: uuid.generate(),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          img: user.img
        },
        idPost: idPost,
        time: new Date().getTime(),
        data: data,
      }).save()
        .then(cmt => res.json({ code: 0, message: "Thanh cong", cmt: cmt}))
        .catch((err) => res.json({ code: 2, message: "Xay ra loi" }))
    }
})

router.delete('/delete/:id', validatorLogin, (req, res) => {
    const id = req.params.id
    commentsModel.deleteOne({id: id})
    .then(() => res.json({ code: 0 , message: "Xoa thanh cong"}))
    .catch((err) => res.json({ code: 1, message: "Xoa that bai"}))
})

router.post('/update', validatorLogin, (req, res) => {
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