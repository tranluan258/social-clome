const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('../configs/keys')
const User = require('../models/user')

passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user)
    })
});

passport.use(new GoogleStrategy({
    clientID: keys.clientID,
    clientSecret: keys.clientSecret,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({id: profile.id}).then(existingUser => {
        if(profile._json.hd == "student.tdtu.edu.vn"){
            if (existingUser) {
                done(null, existingUser);
            } else {
                new User({id: profile.id, name: profile._json.name, email: profile._json.email,img: profile._json.picture, type: '0'}).save().then(user => done(null, user));
            }
        }else{
            done(null, null)
        }
    })
}))