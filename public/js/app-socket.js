var socket = io();
socket.on('addMessage', function(uuid, user, message, date){
    db.messages.add({
        user_uuid: uuid,
        user_name: user, 
        message: message,
        date: date,
        f_info: 0
    });
    showMessage(uuid, user, message, date, 0);
});
socket.on('updateUser', function(user_uuid, oldUser, newUser, date){
    if(user_uuid == uuid){
        oldUser = "You're";
    }
    db.messages.add({
        user_uuid: user_uuid,
        user_name: newUser, 
        message: oldUser+" change name to "+newUser,
        date: date,
        f_info: 2
    });
    showMessage(user_uuid, newUser, oldUser+" change name to "+newUser, date, 2);
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
socket.on('connected', function(){
    console.log("Join");
    db.messages.add({
        user_uuid: uuid,
        user_name: user, 
        message: "Connected",
        date: new Date(),
        f_info: 1
    });
    showMessage(uuid, user, "Connected", new Date(), 1);
});