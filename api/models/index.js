'use strict';

let dbManager = require('../db');

// compile schema into model
let eventModel = dbManager.db.model('Event', require('./event'));

// export model
module.exports.Event = eventModel;
