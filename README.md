# percent auth middleware

This express middleware
reads from a cookie named `percent-auth`, if it exists, it should contain
something like this:

```
%7B%22email%22%3A%22mauricio%40lavabit.com%22%2C%22timestamp%22%3A1391522971884%2C%22signature%22%3A%227NEosnRuRTsats3HKjt4YmeHEZBFMNlu8GT5QxnUF5EjVNcgW6y2kIYYovzXYCrpHw84Aydznvhv7i3McRHDlQ%3D%3D%22%7D
```

If you `decodeURIComponent` it shows this:

```
{"email":"mauricio@lavabit.com","timestamp":1391522971884,"signature":"7NEosnRuRTsats3HKjt4YmeHEZBFMNlu8GT5QxnUF5EjVNcgW6y2kIYYovzXYCrpHw84Aydznvhv7i3McRHDlQ=="}
```

It is a signed session created by the percent servers. it contains the email of
the user who logged in and a unix timestamp of when the loggin happened.

The JSON object contains a `signature` field which is the result of signing it
with [`percent-message-signing`](https://github.com/percent/message-signing)
using app key. The app key should be kept private as it is shared only between
Percent and the app developer and used to sign and verify exchanged messages.

### install:

`npm install percent-auth-middleware`

### usage:

````javascript
var express = require('express');
var percentAuth = require('percent-auth-middleware');

var percentAppKey = 'dWghkFhBB7SvGLZNI5jjHE5mh0U+73TpkKwkRYAlstc=';

var app = express()
  .use(express.cookieParser())
  .use(percentAuth({ key: percentAppKey, maxSessionSeconds: 3600 }));

app.get('/echoUser', echo);

function ensureUser(req, res, next) {
  if (! req.percent.user)
    res.send('No user logged in');
  else
    res.send('User ' + req.percent.user +
    ' logged in ' + req.percent.sessionSeconds + ' seconds ago';
}

var port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log('Listening on http://localhost:%d', port);
});


````

