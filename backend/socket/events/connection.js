const updateUserOnlineState = require("../../controller/updateUserState");
const handleDisconnect = require("./disconnect");
const handleMessage = require("./message");
const handleTyping = require("./typing");
const handleCall= require("./call")

function handleConnection(socket) {
  const connectedUser = socket.request.verifiedUser.username;
  console.log(connectedUser + " is online!");
  updateUserOnlineState(socket, connectedUser, true); //setting user online

  socket.join(connectedUser);//creating a personal room with which other can communicate with me directly
  
  socket.on("send-message",handleMessage);//client sent a message.
  
  socket.on("typing",handleTyping);//client sent a message.
  
  socket.on("outgoing",handleCall);

  //disconnect
  socket.on("disconnect",(reason)=>{handleDisconnect(reason,socket)} );
}

module.exports = handleConnection;
