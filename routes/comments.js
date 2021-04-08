const express = require('express')
const router = express.Router()
const accountModel = require('../models/accounts')
const postModel = require('../models/posts')
const commentsModel = require('../models/comments')
const validatorLogin = require('../middleware/validatorLogin')
const uuid = require('short-uuid')

router.post('/add', validatorLogin, async (req, res) => {
    const { idPost, data } = req.body
    if (!idPost || !data) {
      res.json({ code: 1, message: "Du lieu khong hop le" })
    }
    const id = req.session.passport.user
    const user = await accountModel.findById(id)
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

module.exports = router