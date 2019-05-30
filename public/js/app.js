var socket = io();
socket.on('addMessage', function(uuid, user, message){
    var message = "<li>"+user+": "+message+"</li>";
    console.log(uuid);
    $(message).hide().appendTo(".chat-history ul").slideDown(200);
});
socket.on('updateClient', function(count){
    console.log("Client count: "+count);
    $("#livepeople").html(count);
});

$(document).ready(function(){
    $("#form-chat").submit(function(e){
        e.preventDefault();
        socket.emit('newMessage', uuid, $("#nama").val(), $("#message").val());
        $("#message").val("");
    });
    $("#form-setting").submit(function(e){
        e.preventDefault();
        document.cookie = "user="+$("#nama").val();
    });
});

var user = getCookie("user");
if(user==undefined){
    user = "Guest"
}
$("#nama").val(user);

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
var db = new Dexie("livechat_db");
db.version(1).stores({
    messages: '++id, user_uuid, user_name, message, date, f_info'
});