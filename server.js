'use strict';

const express   = require('express')
var app         = express();
var path 		= require('path');

var ioServer 	= require('./app/socket')(app);
var routes      = require('./app/router')(ioServer);

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/', routes);

app.use(function(req, res, next) {
    res.status(404).sendFile(process.cwd() + '/app/views/index.ejs');
});
