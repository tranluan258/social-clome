const express = require('express');
const uuid = require('short-uuid');
const bcrypt = require('bcrypt')
const accountModel = require('../models/accounts')
const userModel = require('../models/user')
const emailValidator = require('email-validator')
const router = express.Router();

/* GET users listing. */
router.get('/login', (req, res, next) => {
  var error = req.flash('error')
  if (req.session.passport) {
    res.redirect('../')
  } else {
    if (!req.session.email) {
      res.render('login', { email: req.cookies.email, password: "", error: error })
    } else {
      res.redirect('../')
    }
  }
})

router.post('/login', async (req, res, next) => {
  var error = req.flash('error')
  var acc = req.body
  if (acc.email === "") {
    error = "Nhập thiếu email"
  } else if (acc.password === "") {
    error = "Nhập thiếu mật khẩu"
  } else if (!emailValidator.validate(acc.email)) {
    error = "Email không đúng định dạng"
  } else {
    var account = await accountModel.findOne({ email: acc.email })
    if (account) {
      let match = bcrypt.compareSync(acc.password, account.password)
      if (match) {
        if (acc.remember == 'on') {
          res.cookie("email", account.email, { maxAge: 36000000, httpOnly: true })
        }
        req.session.email = acc.email
        req.app.use(express.static(`${req.vars.root}/users/${account.email}`))
        res.redirect("/")
      } else {
        error = "Sai email hoặc mật khẩu"
      }
    }else{
      error = "Sai email hoặc mật khẩu"
    }
  }

  if (error != "") {
    res.render('login', { email: acc.email, error: error, password: acc.password })
  }
})

router.get('/profile/:id', async (req, res) => {
  let id = req.params.id
  let user = await accountModel.findOne({ id: id }) || await userModel.findOne({ googleId: id })
  res.json({ user: user })
})

router.post('/profile/:id', async (req, res) => {

})

router.get('/logout', (req, res, next) => {
  req.session.destroy(function (err) {
    res.redirect('login')
  })
})

module.exports = router
