'use strict';

let Event = require('../models').Event; // import mongoose event model
let errorHandler = require('./errorHandler'); // import error handler decorator
var express = require('express'); // import express framework
let router = express.Router(); // import express router

/**
 * Get events items
 *
 * @param req - IncomingMessage (request) object
 * @param res - ServerResponse (response) object
 */
function getList(req, res) {
    Event.find({}, errorHandler(res, items => res.send(items)));
}

/**
 * Save event item
 *
 * @param req - IncomingMessage (request) object
 * @param res - ServerResponse (response) object
 */
function saveEvent(req, res) {

    if (req.body.text) {
        req.assert('text', '5 to 140 characters required for the event description').len(5, 140);
    }
    if (req.body.date) {
        req.assert("date", "Date is not valid").isValidDate();
    }

    req.assert('text', 'Text is required').notEmpty();
    req.assert("date", "Date is requried").notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(500).send(errors);
        return;
    }

    // get variables from request body
    let name = req.body.text;
    let date = req.body.date;

    // create model object
    let event = new Event({text: name, date: date});

    // save model object
    event.save(errorHandler(res, item => res.status(201).send(item)));
}

// base GET and POST routes for event model type
router.get('/', getList);
router.post('/', saveEvent);

// export event routes
module.exports = router;