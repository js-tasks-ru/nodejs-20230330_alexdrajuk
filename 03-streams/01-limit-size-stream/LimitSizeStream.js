const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    let error = null;
    if (this.limit - chunk.byteLength < 0) {
      error = new LimitExceededError();
    }
    this.limit -= chunk.byteLength;
    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
