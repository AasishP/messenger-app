import React, { useRef, useEffect, useContext, useState } from "react";
import { Box } from "@material-ui/core";
import Message from "../ChatSection/Message";
import SocketContext from "../../../context/SocketContext";
import MessageInput from "./MessageInput";
import axios from "../../../api";
import TypingIndicator from "./TypingIndicator";

function MessagesContainer({ otherEndUser }) {
  const messageContainer = useRef();

  //contexts
  const socket = useContext(SocketContext);
  //states
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState({ state: "", user: "" });

  function updateMessages(msg, otherSide) {
    if (msg.from === otherSide || msg.recipient === otherSide) {
      setMessages((prev) => {
        return [...prev, msg];
      });
    }
  }

  async function getMessages(otherSide) {
    if(!otherSide) return
    const res = await axios.get(`/messages/${otherSide}`);
    const messages = res.data.messages;
    messages &&
      setMessages((prev) => {
        return [...prev, ...messages];
      });
  }

  function resetMessages() {
    setMessages([]); //clear all messages
  }

  useEffect(() => {
    //updateMessages wrapper
    function addMessage(msg) {
      updateMessages(msg, otherEndUser.username);
    }

    socket.on("receive-message", addMessage);//this will receive msg and pass it into addMessage function

    return () => {
      socket.off("receive-message", addMessage);
    };
  }, [socket, otherEndUser]);

  useEffect(() => {
    //scrolling to the buttom after the message is received.
    messageContainer.current.scrollTo(0, messageContainer.current.scrollHeight);
  }, [messages, typing]);

  useEffect(() => {
    otherEndUser && getMessages(otherEndUser.username);
    socket.on("typing", (state, user) => {
      if (user === otherEndUser.username) {
        setTyping({ state, user });
      }
    });

    return () => {
      socket.removeAllListeners("typing");

      resetMessages();
    }; //clear all messages on unmount.
  }, [otherEndUser, socket]);

  return (
    <>
      <Box
        ref={messageContainer}
        style={{
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => {
          return (
            <Message
              key={msg._id || Math.random() * 100000}
              msg={msg}
              prevMsgTimestamp={messages[index - 1]?.timestamp || 0}
              otherEndUser={otherEndUser}
            />
          );
        })}
        {typing.state === "start" && typing.user === otherEndUser.username ? (
          <TypingIndicator />
        ) : null}
      </Box>
      <MessageInput updateMessages={updateMessages} />
    </>
  );
}

export default MessagesContainer;
