var assert = require('assert');
var sign = require('percent-message-signing');

module.exports = createMiddleware;

function createMiddleware(opts) {
  assert(opts, 'need opts');
  assert(opts.key, 'need opts.key');

  return middleware;

  function middleware(req, res, next) {
    var auth = req.cookies['percent-auth'];
    if (! auth)
      return next();

    auth = JSON.parse(auth);
    var signature = auth.signature;
    delete auth.signature;

    var valid = sign(opts.key, auth, signature);
    var age = (Date.now() - auth.timestamp) / 1000;
    if (! valid || opts.maxSessionSeconds && age > opts.maxSessionSeconds)
      res.clearCookie('percent-auth');
    else
      req.percent = { user: auth.email, sessionSeconds: age };

    next();
  }
}

