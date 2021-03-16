const express = require('express');
const uuid = require('short-uuid');
const bcrypt = require('bcrypt')
const accountModel = require('../models/accounts')
const emailValidator = require('email-validator')
const router = express.Router();

/* GET users listing. */
router.get('/login', function (req, res, next) {
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
});

router.post('/login', async function (req, res, next) {
  var error = req.flash('error')
  var acc = req.body
  if (acc.email === "") {
    error = "Nhập thiếu email"
  } else if (acc.password === "") {
    error = "Nhập thiếu mật khẩu"
  } else if (!emailValidator.validate(acc.email)) {
    error = "Email không đúng định dạng"
  } else {
    var account = await accountModel.findOne({ email: acc.email, password: acc.password })
    if (account) {
      if (acc.remember == 'on') {
        res.cookie("email", account.email, { maxAge: 36000000, httpOnly: true })
      }
      req.session.email = acc.email
      res.redirect("../")
    } else {
      error = "Sai email hoặc mật khẩu"
    }
  }

  if (error != "") {
    res.render('login', { email: acc.email, error: error, password: acc.password })
  }
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(function (err) {
    res.redirect('login')
  })
})

router.get('/register', (req, res, next) => {
  res.render('register', { error: "" })
})

router.post('/register', async (req, res, next) => {
  
})

module.exports = router
