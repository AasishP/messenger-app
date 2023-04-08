const express = require("express");
const http = require("http");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./database/connection");

require("dotenv").config();

const app = express();

const httpServer = http.createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});

require("./socket")(io);

//defining PORT
const PORT = process.env.PORT || 5000;

//database connection
connectDB();

//middlewares
app.use(morgan("tiny")); //logs the requests
app.use(express.json({ limit: "10MB" }));
app.use(express.urlencoded({ limit: "10MB", extended: true }));
app.use(cors());

//Routes
app.use("/", require("./routes/router"));

//Listening to the request at PORT
httpServer.listen(PORT, () => {
  console.log(`server is running at port:${PORT}`);
});
