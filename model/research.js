const 
    helpers = require('../helpers'),
    query       = helpers.query,
    connection  = helpers.connection,
    config      = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB
    };

module.exports = 
    {
        add : (data) => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            INSERT research(responsible, title, amount, acadyear) 
                            VALUES (?,?,?,?);
                        `;
                        query(con, q, Object.values(data)).then(
                            result => resolve(result[0]),
                            err => reject(err) 
                        );
                        con.end();
                    },
                    err => reject(err) 
                )
            });
        },

        getById : (id) => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            SELECT id, responsible, title, amount, acadyear 
                            FROM research 
                            WHERE id = ${id}
                        `;
                        query(con, q).then(
                            result => resolve(result[0]),
                            err => reject(err) 
                        );
                        con.end();
                    },
                    err => reject(err) 
                )
            });   
        },

        getAll : () => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            SELECT * 
                            FROM research
                        `;
                        query(con, q).then(
                            result => resolve(result),
                            err => reject(err) 
                        );
                        con.end();
                    },
                    err => reject(err) 
                )
            });   
        },

        getByAcadYear : (year) => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            SELECT id, responsible, title, amount, acadyear FROM research
                            WHERE acadyear = "${year}"
                        `;
                        //JOIN status ON (events.status_id=status.id), DATE_FORMAT(date, "%m") AS date
                        query(con, q).then(
                            result => resolve(result),
                            err => reject(err) 
                        );
                        con.end();
                    },
                    err => reject(err) 
                )
            }); 
        },

        getAcadYear : () => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            SELECT DISTINCT acadyear FROM research
                        `;
                        query(con, q).then(
                            result => resolve(result),
                            err => reject(err) 
                        );
                        con.end();
                    },
                    err => reject(err) 
                )
            }); 
        },

        update : (id, data) => { return new Promise( 
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            UPDATE research
                            SET

                            responsible = ?,
                            title = ?,
                            amount = ?,
                            acadyear = ?
    
                            WHERE id = ${id}
                        `;
                        query(con, q, Object.values(data)).then(
                            result => resolve(result[0]),
                            err => reject(err) 
                        );
                        con.end();
                    },
                    err => reject(err) 
                )
            });
        },

        delete : (id) => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            DELETE FROM research
                            WHERE id = ${id}
                        `;
                        query(con, q).then(
                            result => resolve(result[0]),
                            err => reject(err) 
                        );
                        con.end();
                    },
                    err => reject(err) 
                )
            }); 
        },
    }

