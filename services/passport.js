const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
const keys = require('../configs/keys')
const accountModel = require('../models/accounts')
const bcrypt = require('bcrypt')
const emailValidator = require('email-validator')

passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser((id, done) => {
    accountModel.findById(id).then(user => {
        done(null, user)
    })
});

passport.use(new GoogleStrategy({
    clientID: keys.clientID,
    clientSecret: keys.clientSecret,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    accountModel.findOne({id: profile.id}).then(existingUser => {
        if(profile._json.hd == "student.tdtu.edu.vn"){
            if (existingUser) {
                done(null, existingUser);
            } else {
                new accountModel({id: profile.id, name: profile._json.name, email: profile._json.email,img: profile._json.picture, type: '0'}).save().then(user => done(null, user));
            }
        }else{
            done(null, null)
        }
    })
}))

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    function(username, password, done) {
       if(!emailValidator.validate(username)){
        return done(null, false, { message: 'Email không đúng định dạng' });
       }
      accountModel.findOne({ email: username }, function(err, user) {
        if (err) { return done(null, false, { message: 'Vui lòng nhập đầy đủ email và password' });; }
        if (!user) {
          return done(null, false, { message: 'Sai email hoặc password' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Sai email hoặc password' });
        }
        return done(null, user);
      });
    }
  ));