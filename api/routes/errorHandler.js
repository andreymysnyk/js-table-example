/**
 * Decorator for requests that handle errors
 *
 * @param res - response object
 * @param cb - callback that will be executed if no errors found in response,
 * otherwise immediately send response with error
 *
 * @returns {function(err, context)} - returns function that decorates response handling,
 * returned function will be a callback for mongoose requests
 *
 * Parameters:
 * err     - db request error
 * context - db request data
 */

'use strict';

module.exports = (res, cb) => {
    return (err, context) => {
        if (err) {
            var responseErrors = {};
            for (var key in err.errors) {
                responseErrors[key] = err.errors[key].message;
            }
            res.status(err.statusCode || 500).send(responseErrors);
        } else {
            cb(context);
        }
    };
};