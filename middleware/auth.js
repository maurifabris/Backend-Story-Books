module.exports = {
    // Validaciones para saber que el usuario este logueado
    ensureAuth: function (req, res, next){
        if(req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGuest: function(req, res, next){
        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        } else {
            return next()
        }
    }
}