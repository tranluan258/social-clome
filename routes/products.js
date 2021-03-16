const express = require('express')
const router = express.Router()

router.get('/add', (req, res, next) => {
    res.render('add', {error: ""})
})

module.exports = router