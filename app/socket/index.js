'use strict';

const PORT = process.env.PORT || 4000;

var clientCount = 0;

var init = function(app){
    var server 	= require('http').Server(app);
    var io = require('socket.io')(server);
    io.on('connection', (socket) => {
        console.log('New client connected');
        clientCount++;
        socket.emit('updateClient', clientCount);
        socket.broadcast.emit('updateClient', clientCount);

        socket.on('disconnect', () => {
            console.log('This client disconnected')
            clientCount--;
            socket.emit('updateClient', clientCount);
            socket.broadcast.emit('updateClient', clientCount);
        });

        socket.on('newMessage', function(user, message){
            console.log(message);
            socket.emit('addMessage', user, message);
            socket.broadcast.emit('addMessage', user, message);
        });
    });

    server.listen(PORT, () => {
        console.log(`Listening on http://localhost:${ PORT }`);
    });
    return io;
}

module.exports = init;