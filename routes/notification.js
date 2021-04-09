const express = require('express')
const router = express.Router()

const notificationModel = require('../models/notification')
const accountModel = require('../models/accounts')
const facultyModel = require('../models/faculty')

const uuid  = require('short-uuid')
const validatorLogin = require('../middleware/validatorLogin')

router.get('/detail/:id', validatorLogin, async (req, res) => {
    const id = req.params.id
    const idUser = req.session.passport.user
    let user  = await accountModel.findById(idUser)
    let notification =  await notificationModel.findOne({id: id})
    let faculty =  await facultyModel.find()
    res.render('notification', {notification,user,faculty})
})

router.get('/management', validatorLogin, async (req, res) => {
    const idUser = req.session.passport.user
    let user  = await accountModel.findById(idUser)
    let faculty =  await facultyModel.find()
    let notification = await  notificationModel.find()
    res.render('management',{user, faculty,notification, active: "all"})
})

router.get('/management/:id', validatorLogin, async (req, res) => {
    const id = req.params.id
    const idUser = req.session.passport.user
    let user  = await accountModel.findById(idUser)
    let notification = await notificationModel.find({"faculty.idFaculty": id})
    let faculty =  await facultyModel.find()
    res.render('management',{user, faculty, notification, active: id})
})

router.post('/add',async (req, res) => {
    const {idFaculty,email,datePost,title,data} = req.body
    if(!idFaculty || !email || !title || !data) {
        res.json({code: 2,  message: "Du lieu khong hop le"})
    }
    const user = await accountModel.findOne({ email: email })
    const faculty =  await facultyModel.findOne({id: idFaculty})
    new notificationModel({
        id: uuid.generate(),
        faculty: {
            idFaculty: faculty.id,
            name: faculty.name
        },
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        datePost: datePost,
        time: new Date().getTime(),
        title: title,
        data: data
    }).save()
    .then(() => res.json({ code: 0, message: "Them thanh cong" }))
    .catch(err => res.json({ code: 1, message: "Them that bai"}))
})

module.exports = router