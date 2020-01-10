const 
    router  = require('express').Router(),
    model   = require('../model');

module.exports = (passport) => {
      
    router.get('/signin', (req, res) => {
        if(req.user) res.redirect("/");
        else res.render('signin', { error: req.flash('error')});
    });
        
    router.post(
        '/signin', 
        passport.authenticate('local', { 
            failureRedirect : '/signin',
            badRequestMessage: 'Недостаточно данных',
            failureFlash : true 
        }), 
        (req, res) => res.redirect('/')
    );
        
    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    return router;
}