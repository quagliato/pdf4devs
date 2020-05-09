function InvalidUrlException() {
  this.message = 'Invalid URL.'
  this.code = 0001
  this.statusCode = 404
  if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, InvalidUrlException);
    else
        this.stack = (new Error()).stack;
}

InvalidUrlException.prototype = Object.create(Error.prototype);
InvalidUrlException.prototype.name = "InvalidUrlException";
InvalidUrlException.prototype.constructor = InvalidUrlException;

module.exports = InvalidUrlException