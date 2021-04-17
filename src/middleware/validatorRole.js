const accountModel = require("../models/accounts")
module.exports = async (req, res, next) => {
    if(req.session.passport){
        let id = req.session.passport.user
        let user  = await accountModel.findById(id)
        if(user.type == 1 || user.type == 2){
            next()
        }else{
            res.render('notrole')
        }
    }else{
        res.redirect('/account/login')
    }
}