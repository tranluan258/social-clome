const express = require('express')
const uuid  = require('short-uuid')
const router = express.Router()
const notificationModel = require('../models/notification')
const accountModel = require('../models/accounts')
const validatorLogin = require('../middleware/validatorLogin')
const validatorRole = require('../middleware/validatorRole')

router.get('/:id', validatorLogin, async (req, res) => {
    const id = req.params.id
    let notification =  await notificationModel.findOne({id: id})
    res.render('notification', {notification})
})

router.post('/add',validatorRole ,async (req, res) => {
    const {idFaculty,email,title,data} = req.body
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
        time: new Date().getTime(),
        title: title,
        data: data
    }).save()
    .then(() => res.json({ code: 0, message: "Them thanh cong" }))
    .catch(err => res.json({ code: 1, message: "Them that bai"}))
})

module.exports = router