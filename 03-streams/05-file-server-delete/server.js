const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('node:fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Directories not allowed');
  }

  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, (error) => {
        if (!error) {
          res.statusCode = 200;
          res.end('Success');
          return;
        }
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File not found');
        } else {
          res.statusCode = 500;
          res.end('Something went wrong');
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
