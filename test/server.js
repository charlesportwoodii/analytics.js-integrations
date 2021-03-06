
var slugs = (process.env.tests || '').split(/ *, */);
var express = require('express');
var serve = express.static(__dirname + '/..');
var fs = require('fs');
var hbs = require('hbs');
var path = require('path');


/**
 * App.
 */

var app = express()
  .use(send)
  .set('views', __dirname)
  .engine('html', hbs.__express)
  .get('/coverage', function(_, res){
    res.render('coverage.html');
  })
  .get('*', function (req, res, next) {
    res.render('index.html');
  })
  .listen(4202, function () {
    fs.writeFileSync(__dirname + '/pid.txt', process.pid, 'utf-8');
    console.log('Started testing server on port 4202...');
  });

/**
 * Send
 */

function send(req, res, next){
  var test = 0 == req.url.indexOf('/test/integrations');
  var slug = req.url.split('/').pop().slice(0, -3);
  if (!test) return serve(req, res, next);
  if ('*' == slugs[0]) return serve(req, res, next);
  if (~slugs.indexOf(slug)) return serve(req, res, next);
  res.type('text/javascript');
  res.send(';');
}
