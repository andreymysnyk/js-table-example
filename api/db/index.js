'use strict';

let mongoose = require('mongoose');
let config = require('../config');

// database URI
let dbUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || config.mongoose.uri;

// connect to mongodb
mongoose.connect(dbUrl, config.mongoose.options);

// Mongoose: mpromise (mongoose's default promise library) is deprecated, so use native ES6 promises
mongoose.Promise = global.Promise;

// export mongoose db obj
module.exports.db = mongoose;