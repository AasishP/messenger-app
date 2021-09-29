const { verifyToken } = require("../controller/userAuth");

async function auth(socket, next) {
  const token = socket.handshake.auth.token;
  const verifiedUser = await verifyToken(token);
  socket.request.verifiedUser = verifiedUser;
  verifiedUser && next();
  !verifiedUser && next(new Error("Unauthorized user!"));
}

module.exports=auth;