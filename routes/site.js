const express = require('express');
const router = express.Router();
const fs = require('fs')
const passport = require('passport')
const commentsModel = require('../models/comments')
const accountModel = require('../models/accounts')
const postModel = require('../models/posts')
const facultyModel = require('../models/faculty')
const notificationModel = require('../models/notification')
const validatorLogin = require('../middleware/validatorLogin')
const moment =  require('moment')

router.get('/', validatorLogin , async function (req, res) {
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
    const faculty = await facultyModel.find()
    const notification = await notificationModel.find().sort({time: -1}).limit(5)
    const comments = await commentsModel.find()
    res.render('index', { user,post,comments,faculty,notification,moment })
})

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/account/login', failureFlash : 'Vui lòng chọn mail sinh viên'}), (req, res) => {
 res.redirect('/')
});
module.exports = router;
