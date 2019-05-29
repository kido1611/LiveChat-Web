var socket = io();
socket.on('addMessage', function(user, message){
    console.log(user+" "+message);
});

$(document).ready(function(){
    $("#form-chat").submit(function(e){
        e.preventDefault();
        socket.emit('newMessage', $("#nama").val(), $("#message").val());
    });
});