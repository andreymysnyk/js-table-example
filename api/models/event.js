// import mongoose db obj
let dbManager = require('../db');

// create schema for event model type, export it
module.exports = new dbManager.db.Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

