'use strict';

const PORT = process.env.PORT || 4000;

var init = function(app){
    var server 	= require('http').Server(app);
    var io = require('socket.io')(server);
    io.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('disconnect', () => console.log('Client disconnected'));

    });

    server.listen(PORT, () => {
        console.log(`Listening on http://localhost:${ PORT }`);
    });
    return io;
}

module.exports = init;