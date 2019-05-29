var socket = io();

$(document).ready(function(){
    $("#form-chat").submit(function(e){
        e.preventDefault();
        socket.emit('newMessage', "Nama", "Pesan22");
    });
});