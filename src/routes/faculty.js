const express = require('express')
const router = express.Router()

const facultyModel = require('../models/faculty')
const notificationModel = require('../models/notification')
const accountModel = require('../models/accounts')

const validatorLogin = require('../middleware/validatorLogin')
const uuid = require('short-uuid')

router.get('/', validatorLogin, async (req, res) => {
    let limit = 10
    let number = req.query.page || 1
    let faculty =  await facultyModel.find()
    let idUser  = req.session.passport.user
    let user  = await accountModel.findById(idUser)
    notificationModel
    .find()
    .skip((limit * number) - limit)
    .sort({ time: -1 })
    .exec((err, notification) => {
        notificationModel.countDocuments((err,count) => {
            res.render('faculty', {user,faculty, notification, currentPage: number, countPage: Math.ceil(count/limit), active: "all"})
        })
    })
})

router.get('/:id', validatorLogin, async (req, res) => {
    let limit = 10
    let number = req.query.page || 1
    let id = req.params.id
    let faculty = await facultyModel.find()
    let idUser  = req.session.passport.user
    let user  = await accountModel.findById(idUser)
    notificationModel
    .find({"faculty.idFaculty" : id})
    .skip((limit * number) - limit)
    .sort({ time: -1 })
    .exec((err, notification) => {
        notificationModel.find({"faculty.idFaculty" : id}).countDocuments((err,count) => {
            res.render('faculty', {user,faculty, notification, currentPage: number, countPage: Math.ceil(count/limit), active: id })
        })
    })
})

router.post("/add", async (req, res) => {
    const {name} =  req.body
    if(name){
        new facultyModel({
            id: uuid.generate(),
            name: name
        }).save()
        .then(() => res.json({ code: 0, message: "Thanh cong"}))
        .catch((err) => res.json({ code: 1, message: "That bai" }))
    }
})

router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    let faculty =  await facultyModel.findOne({id: id})
    if(faculty){
        facultyModel.deleteOne({id: id})
        .then(() => res.json({ code: 0, message: "Thanh cong"}))
        .catch((err) => res.json({ code: 1, message: "That bai" }))
    }
})

module.exports = router