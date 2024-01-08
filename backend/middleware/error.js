const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error"

    //mongodb error (wrong id format error of mongodb,etc)
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //MongoDB Duplicate key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }
    //Wrong JWT Token
    if (err.name === 'JsonWebTokenError') {
        const message = `Json Web Token is invalid, please try again`;
        err = new ErrorHandler(message, 400);
    }
    //JWT Expire Error
    if (err.name === 'TokenExpiredError') {
        const message = `Json Web Token has expired, please try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });

}