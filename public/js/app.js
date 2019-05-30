var socket = io();
socket.on('addMessage', function(uuid, user, message, date){
    db.messages.add({
        user_uuid: uuid,
        user_name: user, 
        message: message,
        date: date,
        f_info: false
    });
    showMessage(uuid, user, message, date, 0);
});
socket.on('updateUser', function(uuid, oldUser, newUser, date){
    db.messages.add({
        user_uuid: uuid,
        user_name: newUser, 
        message: oldUser+" change name to "+newUser,
        date: date,
        f_info: 2
    });
    showMessage(uuid, newUser, oldUser+" change name to "+newUser, date, 2);
});
socket.on('updateClient', function(count){
    $("#livepeople").html(count);
});
socket.on('disconnect', function(){
    db.messages.add({
        user_uuid: uuid,
        user_name: user, 
        message: "Disconnected",
        date: new Date(),
        f_info: 1
    });
});
window.onunload = function () {
    socket.disconnect();
};
$(document).ready(function(){
    $("#form-chat").submit(function(e){
        e.preventDefault();
        socket.emit('newMessage', uuid, $("#nama").val(), $("#message").val());
        $("#message").val("");
    });
    $("#form-setting").submit(function(e){
        e.preventDefault();
        if(user == $("#nama").val()){
            return;
        }
        socket.emit('changeName', uuid, user, $("#nama").val());
        document.cookie = "user="+$("#nama").val();
        user = $("#nama").val();
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

db.messages.each(function(message){
    showMessage(message.user_uuid, message.user_name, message.message, message.date, message.f_info);
});

function showMessage(uuid, user, message, date, f_info){
    if(f_info == 0){
        var item = "<li>"+user+": "+message+"</li>";
    }
    else if(f_info == 1){
        var item = "<li>You're disconnected</li>";
    }else if(f_info == 2){
        var item = "<li>"+message+"</li>";
    }
    $(item).hide().appendTo(".chat-history ul").slideDown(200);
}