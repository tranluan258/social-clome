module.exports = (req, res, next) => {
    if(req.session.passport){
        let user = req.session.passport
        if(user.type == '1' || user.type == '2'){
            next()
        }else{
            next(createError(404))
        }
    }else{
        res.redirect('/account/login')
    }
}