function handleTyping(recipient,state){
    const socket = this;
    const connectedUser = socket.request.verifiedUser.username;
    socket.to(recipient).emit("typing", state,connectedUser);
    console.log(recipient,state);
}

module.exports=handleTyping;