const express = require('express');
const uuid = require('short-uuid');
const bcrypt = require('bcrypt');
const accountModel = require('../models/accounts');
const postModel = require('../models/posts');
const validatorLogin = require('../middleware/validatorLogin');
const router = express.Router();
const passport = require('passport')
/* GET users listing. */
router.get('/login', (req, res, next) => {
  var error = req.flash('error')
  if (req.session.passport) {
    res.redirect('../')
  } else {
    res.render('login', { email: "", password: "", error: error })
  }
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'login',
    failureFlash: true
  })
)

router.get('/profile/:id', validatorLogin, async (req, res) => {
  let id = req.params.id
  let user = await accountModel.findOne({ id: id })
  let post = await postModel.find({ "user.email": user.email })
  res.render('profile', { user, post })
})

router.post('/update', validatorLogin, async (req, res) => {
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(function (err) {
    res.redirect('login')
  })
})

router.post('/updatePassword', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body
  const user = await accountModel.findOne({ email: email })
  let match = bcrypt.compareSync(oldPassword, user.password)
  if (match) {
    let hashPass = bcrypt.hashSync(newPassword, 10)
    accountModel.findOneAndUpdate({
      email: user.email,
    },
      {
        password: hashPass
      })
      .then(() => {
        res.json({ code: 0, message: "Thanh cong" })
      })
      .catch(err => res.json({ code: 1, message: "That bai" }))
  } else {
    res.json({ code: 2, message: "Sai mat khau" })
  }
})

router.post('/add', async (req, res) => {
  const { email, name, password, arrFaculty } = req.body
  if (!email || !name || !password || !arrFaculty) {
    res.json({ code: 1, message: "Du lieu khong hop le" })
  } else {
    let hashPassword = bcrypt.hashSync(password, 10)
    new accountModel({
      id: uuid.generate(),
      name: name,
      email: email,
      password: hashPassword,
      img: "",
      type: 1,
      arrFaculty: arrFaculty
    }).save()
      .then(() => {
        res.json({ code: 0, message: "Thanh cong" })
      })
      .catch(err => { res.json({ code: 200, message: "That bai" }) })
  }

})

module.exports = router
