'use strict';

var init = function(socket){
    var express     = require('express');
    var router      = express.Router();

    router.get('/', function(req, res, next){
        res.render('index');
    });
    router.get('/clients', function(req,res,next){
        res.send(socket.sockets.sockets.length);
    });
    router.get('/setting', function(req, res, next){
        res.render('setting');
    });

    return router;
}


module.exports = init;