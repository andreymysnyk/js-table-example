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
module.exports = (res, cb) => {
    return (err, context) => {
        if (err) {
            res.status(err.statusCode || 502).send({
                message: err.message, // db error message
                errors: err.errors // db fields errors
            });
        } else {
            cb(context);
        }
    };
};