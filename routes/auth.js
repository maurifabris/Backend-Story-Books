const express = require('express')
const passport = require('passport')
const router = express.Router()
const flash = require('connect-flash');

// @desc auth with google
//@route GET /auth/google
router.get('/google', passport.authenticate('google',{ scope: ['profile']}))

// @desc Google auth callback
//@route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}),(req, res) =>{
    res.redirect('/dashboard')
})

// @desc Logout user
// @route /auth/logout
// routes/auth.js
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success_msg', 'Has cerrado sesión correctamente');
      res.redirect('/');
    });
  });

  
module.exports = router 