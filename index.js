'use strict';

let moment = require('moment');
let express = require('express'); // import express framework
let routes = require('./api/routes'); // import custom app routes
let bodyParser = require('body-parser'); // requests body parser for express
let validator = require('express-validator');

let app = express(); // express instance

app.set('port', process.env.PORT || 5000); // port used by server, use from node environment or custom value

// site assets
app.use(express.static(__dirname + '/table-app/dist'));
// uses middleware to handle the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator({
    customValidators: {
        isValidDate: function(date) {
            return moment(date, 'YYYY-MM-DD HH:mm', true).isValid();
        }
    }
}));

// use base events route related to the /api/events uri
app.use('/api/events', routes.events);

// server listen post that is set above
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
