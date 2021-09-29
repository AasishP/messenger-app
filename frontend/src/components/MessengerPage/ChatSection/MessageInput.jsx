import { Box, IconButton, TextField, makeStyles } from "@material-ui/core";
import { Attachment, ImageRounded, Send } from "@material-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import SocketContext from "../../../context/SocketContext";

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    width: "60%",
    minWidth: "300px",
    borderRadius: "20px",
    margin: "1.5em auto",
    padding: "1em",
  },
});

function MessageInput({ updateMessages }) {
  const classes = useStyles();
  const Socket = useContext(SocketContext);
  //receipient
  const recipient = useParams().username;

  const [textFieldValue, setTextFieldValue] = useState("");
  const [typing, setTyping] = useState("");

  //custom events
  function dispatchSendMessage(message) {
    const sendMessage = new CustomEvent("sendMessage", { detail: message });
    document.dispatchEvent(sendMessage); //firing sendMessage event.
  }

  useEffect(() => {
    switch (typing) {
      case "start":
        Socket.emit("typing", recipient, "start");
        break;
      case "stop":
        Socket.emit("typing", recipient, "stop");
        break;
      default:
        break;
    }
  }, [typing, recipient, Socket]);

  useEffect(() => {
    setTextFieldValue("");
  }, [recipient]);

  function sendMessage(e) {
    e.preventDefault();

    if (textFieldValue) {
      const message = {
        _id: Math.random(),
        recipient,
        text: textFieldValue,
      };
      updateMessages(message);

      Socket.emit("send-message", message);

      dispatchSendMessage(message); //firing sendMessage event.
      setTyping("stop");
      setTextFieldValue("");
    }
  }

  function handleChange(e) {
    e.target.value ? setTyping("start") : setTyping("stop");
    setTextFieldValue(e.target.value);
  }
  return (
    <form onSubmit={sendMessage} style={{ marginTop: "auto" }}>
      <Box className={classes.root} boxShadow={5}>
        <IconButton>
          <ImageRounded color="primary" />
        </IconButton>
        <IconButton>
          <Attachment color="primary" />
        </IconButton>
        <TextField
          fullWidth
          placeholder="Type something to send..."
          autoFocus
          aria-label="message input box"
          value={textFieldValue}
          onChange={handleChange}
        />
        <IconButton type="submit">
          <Send color="primary" />
        </IconButton>
      </Box>
    </form>
  );
}

export default MessageInput;
