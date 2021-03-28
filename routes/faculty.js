const express = require('express')
const uuid = require('short-uuid')
const facultyModel = require('../models/faculty')
const notificationModel = require('../models/notification')
const validatorLogin = require('../middleware/validatorLogin')
const router = express.Router()

router.get('/', validatorLogin, async (req, res) => {
    let limit = 10
    let number = req.params.number || 1
    let faculty =  await facultyModel.find()
    notificationModel
    .find()
    .skip((limit * number) - limit)
    .exec((err, notification) => {
        notificationModel.countDocuments((err,count) => {
            res.render('faculty', {faculty, notification, currentPage: number, countPage: Math.ceil(count/limit) })
        })
    })
})

router.get('/:id', validatorLogin, async (req, res) => {
    let number = req.params.number || 1
    let id = req.params.id
    let faculty = await facultyModel.findOne({id: id})
    notificationModel
    .find({"faculty.idFaculty" : id})
    .skip((limit * number) - limit)
    .exec((err, notification) => {
        notificationModel.countDocuments((err,count) => {
            res.render('faculty', {faculty, notification, currentPage: number, countPage: Math.ceil(count/limit) })
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