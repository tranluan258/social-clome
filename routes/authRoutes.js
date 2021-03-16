// /routes/passport.js

const passport = require('passport');

module.exports = (app) => {

    /**
     * SignIn.
     */
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    /**
     * Callback from Google.
     */
    app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/account/login', failureFlash : 'Vui lòng chọn mail sinh viên'}), (req, res) => {
       res.redirect('/')
    });

    /**
     * Logout.
     */
    app.get('/api/logout', (req, res) => {
        req.logout();
        res.send(req.user);
    });

    /**
     * Get current user.
     */
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
};