const express = require('express');
const router = express.Router();
const userModel = require('../models/user')
const fs = require('fs')
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
    const post = await postModel.find({ email: user.email })
    res.render('index', { user,post })

  }
})

module.exports = router;
