const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function (passport) {
    // Estrategia de Google
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
         const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        };
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                return done(null, user);
            } else {
                // Verificar si el email ya está registrado (para evitar duplicados)
                const existingUser = await User.findOne({ email: newUser.email });
                if (existingUser) {
                    // Si existe, actualizar con datos de Google
                    existingUser.googleId = profile.id;
                    existingUser.image = newUser.image;
                    await existingUser.save();
                    return done(null, existingUser);
                } else {
                    user = await User.create(newUser);
                    return done(null, user);
                }
            }
        } catch (err) {
            console.error(err);
            return done(err, null);
        }
    }));

    // Estrategia local
    passport.use(
        'local',
        new LocalStrategy(
            { usernameField: 'email' }, 
            async (email, password, done) => {
                try {
                    // Buscar usuario por email, incluyendo el campo password
                    const user = await User.findOne({ email }).select('+password');
                    
                    if (!user) {
                        return done(null, false, { message: 'El email no está registrado' });
                    }
                    
                    // Verificar si el usuario tiene contraseña 
                    if (!user.password) {
                        return done(null, false, { message: 'Este email está registrado con Google. Por favor inicia sesión con Google.' });
                    }
                    
                    // Comparar contraseñas
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (!isMatch) {
                        return done(null, false, { message: 'Contraseña incorrecta' });
                    }
                    
                    // Autenticación exitosa
                    return done(null, user);
                } catch (err) {
                    console.error(err);
                    return done(err, null);
                }
            }
        )
    );

    // Serialización y deserialización 
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};