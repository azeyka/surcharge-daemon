const express = require('express');
const controllers = require('../controllers');

module.exports = (app) => {
    const router = express.Router();
    router.post('/add', controllers.addSurcharge); 
    router.get('/:id', controllers.getSurcharge);

    app.use('/surcharges', router);
}