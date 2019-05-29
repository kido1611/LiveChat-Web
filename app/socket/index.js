'use strict';

var init = function(app){
    var server 	= require('http').Server(app);
    var io = require('socket.io')(server);

    return server;
}

module.exports = init;