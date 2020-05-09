function InvalidPageSizeException() {
  this.message = 'Invalid page size.'
  this.code = 0002
  this.statusCode = 400
  if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, InvalidPageSizeException);
    else
        this.stack = (new Error()).stack;
}

InvalidPageSizeException.prototype = Object.create(Error.prototype);
InvalidPageSizeException.prototype.name = "InvalidPageSizeException";
InvalidPageSizeException.prototype.constructor = InvalidPageSizeException;

module.exports = InvalidPageSizeException