module.exports = (passport) => {
    return {
        auth:       require('./auth.routes')(passport),
        events:     require('./events.routes')(passport),
        research:   require('./research.routes')(passport),
    }
}