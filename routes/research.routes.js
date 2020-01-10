const 
    router          = require('express').Router(),
    model           = require('../model'),
    ensureLoggedIn  = require('connect-ensure-login').ensureLoggedIn;

module.exports = (passport) => {
    router.get('/', (req, res) => {
        let acadyear = req.query.acadyear || "";
        model.research.getByAcadYear(acadyear).then(
            research => {
                model.research.getAcadYear(acadyear).then(
                    acadyears => {
                        if (research.length == 0) model.research.getAll().then(
                            research => res.render(
                                'research/index', 
                                {acadyear:false, acadyears, research}
                            ),
                            err => { 
                                console.error(err);
                                res.redirect('/500');                     
                            }
                        )    
                        else res.render(
                            'research/index', 
                            {acadyear, acadyears, research}
                        );
                    },
                    err => { 
                        console.error(err);
                        res.redirect('/500');                     
                    }
                )
            },
            err => { 
                console.error(err);
                res.redirect('/500');                  
            }
        )
    });
      
    router.get('/add', ensureLoggedIn('/signin'), (req, res) => {
        res.render('research/add', { message: req.flash('message')});
    });

    router.post('/add', ensureLoggedIn('/signin'), (req, res) => {
        model.research.add({
            responsible: req.body.responsible,
            title: req.body.title,
            amount: req.body.amount,
            acadyear: req.body.acadyear
        }).then(
            status => res.redirect('/research'),
            err => { 
                console.error(err);
                req.flash('message', 'Ошибка внесения в БД, пожалуйста проверьте данные.');   
                res.redirect('/research/add');                
            }
        );
    });

    router.get('/edit/:id', ensureLoggedIn('/signin'), (req, res) => {
        model.research.getById(req.params.id).then(
            research => {
                if(!research) res.redirect('/404');
                res.render('research/edit', { research, message: req.flash('message')});
            },
            err => { 
                console.error(err);
                res.redirect('/500');                
            }
        );
    });

    router.post('/edit', ensureLoggedIn('/signin'), (req, res) => {
        let id = req.body.id;
        model.research.update(id, {
            responsible: req.body.responsible,
            title: req.body.title,
            amount: req.body.amount,
            acadyear: req.body.acadyear
        }).then(
            status => { 
                req.flash('message', 'Данные успешно занесены в БД.');   
                res.redirect('/research/edit/' + id);                
            },
            err => { 
                console.error(err);
                req.flash('message', 'Ошибка внесения в БД, пожалуйста проверьте данные.');   
                res.redirect('/research/edit/' + id);                
            }
        );
    });

    router.post('/delete', ensureLoggedIn('/signin'), (req, res) => {
        let id = req.body.id;
        model.research.delete(id).then(
            status => res.redirect('/research'),
            err => { 
                console.error(err);
                req.flash('message', 'Ошибка удаления.');   
                res.redirect('/research/edit/' + id);                
            }
        );
    });

    router.get('/csv', ensureLoggedIn('/signin'), (req, res) => {
        res.render('research/csv', { message: req.flash('message')});   
    });

    return router;
}