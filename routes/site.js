const express = require('express');
const router = express.Router();
const userModel = require('../models/user')
const fs = require('fs')
const commentsModel = require('../models/comments')
const accountModel = require('../models/accounts')
const postModel = require('../models/posts')
/* GET home page. */
router.get('/', async function (req, res, next) {
  if (!req.session.passport && !req.session.email) {
    res.redirect('/account/login')
  } else {
    let user = null

    if (req.session.passport) {
      let id = req.session.passport.user
      user = await userModel.findById(id)
      let { root } = req.vars
      let dir = `${root}/users/${user.email}`
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
    }
    if (req.session.email) {
      let email = req.session.email
      user = await accountModel.findOne({ email: email })
    }
    
    req.session.user = user
    const post = await postModel.find().sort({time: -1}).limit(10)
    const comments = await commentsModel.find().sort({time: -1})
    res.render('index', { user,post,comments })
  }
})

module.exports = router;
