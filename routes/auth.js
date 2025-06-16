const express = require('express')
const passport = require('passport')
const router = express.Router()
const flash = require('connect-flash');
const User = require('../models/User')

// @desc auth with google
//@route GET /auth/google
router.get('/google', passport.authenticate('google',{ scope: ['profile']}))

// @desc Google auth callback
//@route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}),(req, res) =>{
    res.redirect('/dashboard')
})

// @desc Show login form
// @route GET /auth/login
router.get('/login', (req, res) => {
    res.render('auth/login', {
        layout: 'login'
    })
})

// @desc Process login form
// @route POST /auth/login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next)
})

// @desc Show register form
// @route GET /auth/register
router.get('/register', (req, res) => {
    res.render('auth/register', {
        layout: 'login'
    })
})

// @desc Process register form
// @route POST /auth/register
router.post('/register', async (req, res) => {
    const { displayName, email, password, password2 } = req.body
    
    try {
        // Verificar si el usuario ya existe
        let user = await User.findOne({ email })
        if (user) {
            req.flash('error_msg', 'El email ya está registrado')
            return res.redirect('/auth/register')
        }

        // Crear nuevo usuario
        user = new User({
            displayName,
            email,
            password // Se hasheará automáticamente en el modelo
        })

        await user.save()

        // Iniciar sesión automáticamente después del registro
        req.login(user, (err) => {
            if (err) throw err
            req.flash('success_msg', '¡Registro exitoso! Ahora estás conectado')
            res.redirect('/dashboard')
        })

    } catch (err) {
        console.error(err)
        req.flash('error_msg', 'Error en el servidor')
        res.redirect('/auth/register')
    }
})

// @desc Logout user
// @route GET /auth/logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err) }
        req.flash('success_msg', 'Has cerrado sesión correctamente')
        res.redirect('/')
    })
})

module.exports = router