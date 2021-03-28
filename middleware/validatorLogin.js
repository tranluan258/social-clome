module.exports = (req,res,next) => {
    if(req.session.passport || req.session.email){
        next();
    }else {
        res.redirect('/account/login')
    }
}