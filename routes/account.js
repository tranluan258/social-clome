const express = require('express');
const uuid = require('short-uuid');
const bcrypt = require('bcrypt');
const accountModel = require('../models/accounts');
const userModel = require('../models/user');
const emailValidator = require('email-validator');
const postModel = require('../models/posts');
const validatorLogin = require('../middleware/validatorLogin');
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

router.get('/profile/:id', validatorLogin, async (req, res) => {
  let id = req.params.id
  let user = await accountModel.findOne({ id: id }) || await userModel.findOne({ id: id })
  let post =  await postModel.find({"user.email" : user.email})
  res.render('profile', { user,post })
})

router.post('/update', validatorLogin ,async (req, res) => {
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(function (err) {
    res.redirect('login')
  })
})

router.post('/updatePassword', async (req, res) => {
  const {email, oldPassword, newPassword} = req.body
  const user = await accountModel.findOne({ email: email })
  let match = bcrypt.compareSync(oldPassword,user.password)
  if(match){
    let hashPass = bcrypt.hashSync(newPassword,10)
    accountModel.findOneAndUpdate({
        email: user.email,
    },
    {
      password: hashPass
    })
    .then(() => {
      res.json({code: 0, message:"Thanh cong"})
    })
    .catch(err => res.json({code:1, message: "That bai"}))
  }else {
    res.json({code: 2, message: "Sai mat khau"})
  }
})

router.post('/add', async (req, res) => {
  const {email,name,password,arrFaculty} = req.body
  if(!email || !name || !password || !arrFaculty){
    res.json({code: 1, message: "Du lieu khong hop le"})
  }else {
    let hashPassword = bcrypt.hashSync(password,10)
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
      res.json({code: 0, message: "Thanh cong"})
    })
    .catch(err => {res.json({code: 200, message: "That bai"})})
  }
  
})

module.exports = router
