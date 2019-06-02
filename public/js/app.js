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
        Cookies.set('user', $("#nama").val());
        user = $("#nama").val();
    });
    $("#message").keyup(function(event){
        if(event.keyCode === 13 && !event.shiftKey){
            event.preventDefault();
            $("#form-chat").submit();
            $(this).focus();
        }
    });
});

var user = Cookies.get('user');
if(user==undefined){
    user = "Guest"
}
$("#nama").val(user);

var uuid = Cookies.get('user_uuid');
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

var db = new Dexie("livechat_db");
db.version(1).stores({
    messages: '++id, user_uuid, user_name, message, date, f_info'
});

db.messages.each(function(message){
    showMessage(message.user_uuid, message.user_name, message.message, message.date, message.f_info, false);
}).then(function(){
    scrollBottom();
});

function showMessage(user_uuid, user_name, message, date, f_info, scroll = true){
    var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    if(typeof date == "string"){
        
        date = new Date(date);
    }
    else if(typeof date == "object"){
        
    }
    var dates = date.getDate()+" "+bulan[date.getMonth()-1]+" "+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
    
    if(f_info == 0){
        if(user_uuid == uuid){
            var item = "<li class=\"row m-1\"><div class=\"col-9 col-md-10 offset-3 offset-md-2 message-container message-self\"><span class=\"message-name\">"+user_name+"</span> - <span class=\"message-date\">"+dates+"</span><br/><span class=\"message-content\">"+message+"</span></div></li>";
        }
        else
        {
            var item = "<li class=\"row m-1\"><div class=\"col-9 col-md-10 message-container\"><span class=\"message-name\">"+user_name+"</span> - <span class=\"message-date\">"+dates+"</span><br/><span class=\"message-content\">"+message+"</span></div></li>";
        }
    }
    else if(f_info == 1){
        var item = "<li class=\"row m-1\"><div class=\"col-12 message-container message-info text-center\"><span class=\"message-content text-center\">"+message+" at "+dates+"</span></div></li>";
    }
    else if(f_info == 2){
        var item = "<li class=\"row m-1\"><div class=\"col-12 message-container message-info text-center\"><span class=\"message-content text-center\">"+message+" at "+dates+"</span></div></li>";
    }
    $(item).hide().appendTo(".chat-history ul").slideDown(200);
    if(scroll){
        scrollBottom();
    }
}

function scrollBottom(){
    $('html, body').animate({
        scrollTop: document.body.scrollHeight
    }, "fast");
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/sw.js")
        .then(function() {
            console.log("Pendaftaran ServiceWorker berhasil");
        })
        .catch(function() {
            console.log("Pendaftaran ServiceWorker gagal");
        });
    });
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}