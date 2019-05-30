'use strict';

const PORT = process.env.PORT || 4000;

var clientCount = 0;

var init = function(app){
    var server 	= require('http').Server(app);
    var io = require('socket.io')(server);
    io.on('connection', (socket) => {
        clientCount++;
        console.log('New client connected. Size: '+clientCount);
        socket.emit('updateClient', clientCount);
        socket.broadcast.emit('updateClient', clientCount);

        socket.on('disconnect', () => {
            clientCount--;
            console.log('This client disconnected. Size: '+clientCount)
            socket.emit('updateClient', clientCount);
            socket.broadcast.emit('updateClient', clientCount);
        });

        socket.on('newMessage', function(uuid, user, message){
            console.log("From "+user+"("+uuid+") send "+message);
            socket.emit('addMessage', uuid, user, message, new Date());
            socket.broadcast.emit('addMessage', uuid, user, message, new Date());
        });

        socket.on('changeName', function(uuid, oldUser, newUser){
            console.log("User UUID "+uuid+" change name from "+oldUser+" to "+newUser);
            socket.emit('updateUser', uuid, oldUser, newUser, new Date());
            socket.broadcast.emit('updateUser', uuid, oldUser, newUser, new Date());
        });
    });

    server.listen(PORT, () => {
        console.log(`Listening on http://localhost:${ PORT }`);
    });
    return io;
}

module.exports = init;