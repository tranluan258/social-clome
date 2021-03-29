const express = require('express');
const router = express.Router();
const fs = require('fs')
const commentsModel = require('../models/comments')
const accountModel = require('../models/accounts')
const postModel = require('../models/posts')
const validatorLogin = require('../middleware/validatorLogin')
/* GET home page. */
router.get('/', validatorLogin , async function (req, res, next) {
    let user = null
    if (req.session.passport) {
      let id = req.session.passport.user
      user = await accountModel.findById(id)
      let { root } = req.vars
      let dir = `${root}/users/${user.email}`
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
    }
    const post = await postModel.find().sort({time: -1}).limit(10)
    const comments = await commentsModel.find().sort({time: -1})
    res.render('index', { user,post,comments })
})

module.exports = router;
