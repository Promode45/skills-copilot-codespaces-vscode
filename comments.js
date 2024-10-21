// create web server
var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var url = require('url');

var comments = [];
var server = http.createServer(function(req, res) {
  var url_parts = url.parse(req.url);
  if (req.method === 'POST' && url_parts.pathname === '/comment') {
    var body = '';
    req.on('data', function(data) {
      body += data;
    });

    req.on('end', function() {
      var comment = qs.parse(body);
      comments.push(comment.comment);
      res.writeHead(302, {
        'Location': '/'
      });
      res.end();
    });
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.write('<!DOCTYPE html>' +
      '<html>' +
      ' <head>' +
      ' <title>Comment Board</title>' +
      ' </head>' +
      ' <body>' +
      ' <h1>Comment Board</h1>' +
      ' <form method="post" action="/comment">' +
      ' <textarea name="comment"></textarea>' +
      ' <input type="submit" value="OK" />' +
      ' </form>' +
      ' <div>' +
      comments.map(function(comment) {
        return '<p>' + comment + '</p>';
      }).join('') +
      ' </div>' +
      ' </body>' +
      '</html>');
    res.end();
  }
});

server.listen(3000);