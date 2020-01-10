const 
    router  = require('express').Router(),
    model   = require('../model'),
    ensureLoggedIn  = require('connect-ensure-login').ensureLoggedIn;

module.exports = (passport) => {
    router.get('/', (req, res) => {
        let loggedIn = req.user ? true : false;
        res.render('events/index', { loggedIn });
    });

    router.post('/', (req, res) => {
        let year = req.body.year;
        if (!year) res.redirect('/404');
        model.event.getByYear(year).then(
                events => res.send(events),
                err => { 
                    console.error(err);
                    res.redirect('/500');                   
                }
        );
    });

    router.post('/view', (req, res) => {
        let id = req.body.id;
        console.log(id);
        if (!id) res.redirect('/404');
        model.event.getById(id).then(
                events => res.send(events),
                err => { 
                    console.error(err);
                    res.redirect('/500');                    
                }
        );
    });

    router.get('/add', ensureLoggedIn('/signin'), (req, res) => {
        model.event.getStatus().then(
            status => res.render('events/add', { date: req.query.date, status, message: req.flash('message')}),
            err => { 
                console.error(err);
                res.redirect('/500');                  
            }
        );
    });

    router.post('/add', ensureLoggedIn('/signin'), (req, res) => {
        model.event.add({
            statusID: req.body.status,
            title: req.body.title,
            link: req.body.link,
            date: req.body.date,
            place: req.body.place,
            participants: req.body.participants,
            footing: req.body.footing,
            responsible: req.body.responsible
        }).then(
            status => res.redirect('/events#'+ parseInt(req.body.date)),
            err => { 
                console.error(err);
                req.flash('message', 'Ошибка внесения в БД, пожалуйста проверьте данные.');   
                res.redirect('/events/add?date=' + req.body.date);                
            }
        );
    });

    router.get('/edit/:id', ensureLoggedIn('/signin'), (req, res) => {
        model.event.getById(req.params.id).then(
            event => {
                model.event.getStatus().then(
                    status => res.render('events/edit', { status, event, message: req.flash('message')}),
                    err => { 
                        console.error(err);
                        res.redirect('/500');                     
                    }
                ); 
            },
            err => { 
                console.error(err);
                res.redirect('/500');                
            }
        );
    });

    router.post('/edit', ensureLoggedIn('/signin'), (req, res) => {
        let id = req.body.id;
        model.event.update(id, {
            statusID: req.body.status,
            title: req.body.title,
            link: req.body.link,
            date: req.body.date,
            place: req.body.place,
            participants: req.body.participants,
            footing: req.body.footing,
            responsible: req.body.responsible
        }).then(
            status => res.redirect('/events#'+ parseInt(req.body.date)),
            err => { 
                console.error(err);
                req.flash('message', 'Ошибка внесения в БД, пожалуйста проверьте данные.');   
                res.redirect('/events/edit/' + id);                
            }
        );
    });

    router.post('/delete', ensureLoggedIn('/signin'), (req, res) => {
        let id = req.body.id;
        model.event.delete(id).then(
            status => res.redirect('/events#'+ parseInt(req.body.date)),
            err => { 
                console.error(err);
                req.flash('message', 'Ошибка внесения в БД, пожалуйста проверьте данные.');   
                res.redirect('/events/edit/' + id);                
            }
        );
    });

    router.get('/download/report/:year', (req, res) => {
        const file = `${__dirname}/docx/buf/${generated}.docx`;
        res.download(file, 'request.pdf', (e) => {
            if (e & !res.headersSent) {
              // Handle error, but keep in mind the response may be partially-sent
              // so check res.headersSent
            } else {
              // decrement a download credit, etc.
            }
        }); 
    });

    router.get('/download/request/:year', (req, res) => {
        let file = `${__dirname}/docx/buf/${generated}.docx`;
        res.download(file, 'request.docx', (e) => {
            /*
            if (e & !res.headersSent) {
              // Handle error, but keep in mind the response may be partially-sent
              // so check res.headersSent
            } else {
                
            };
            */
            fs.unlinkSync(file);
        }); 
    });

    return router;
}