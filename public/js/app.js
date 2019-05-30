var socket = io();
socket.on('addMessage', function(user, message){
    var message = "<li>"+user+": "+message+"</li>";
    $(message).hide().appendTo(".chat-history ul").slideDown(200);
});
socket.on('updateClient', function(count){
    console.log("Client count: "+count);
    $("#livepeople").html(count);
});

$(document).ready(function(){
    $("#form-chat").submit(function(e){
        e.preventDefault();
        socket.emit('newMessage', $("#nama").val(), $("#message").val());
        $("#message").val("");
    });
    $("#form-setting").submit(function(e){
        e.preventDefault();
        document.cookie = "nama="+$("#nama").val();
    });
});

var nama = getCookie("nama");
if(nama==undefined){
    nama = "Guest"
}
$("#nama").val(nama);

var uuid = getCookie("user_uuid");
if(uuid==undefined){
    console.log("Getting user UUID");
    $.ajax({
        method: "GET",
        url: "/randomids",
        success: function(data, textStatus, jqXHR){
            uuid = data;
            document.cookie = "user_uuid="+uuid;
        },
        done: function(jqXHR){
            console.log("User UUID: "+uuid);
        }
    });
}
else
{
    console.log("User UUID: "+uuid);
}

function getCookie(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for(var i = 0; i < ca.length; i++){
        var c = ca[i];
        while(c.charAt(0) == ' '){
            c = c.substring(1);
        }
        if(c.indexOf(name) == 0){
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}