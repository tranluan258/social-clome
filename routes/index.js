const express = require('express');
const router = express.Router();
const userModel = require('../models/user')
const accountModel = require('../models/accounts')
/* GET home page. */
router.get('/', async function (req, res, next) {
  if (!req.session.passport && !req.session.email) {
        res.redirect('/account/login')
  } else {
    if (req.session.passport) {
      let id = req.session.passport.user
      let user = await userModel.findById(id)
      res.render('index', { user })
    }
    if (req.session.email) {
      let email = req.session.email
      let user = await accountModel.findOne({email: email})
      res.render('index', { user })
    }
  }
})

module.exports = router;
