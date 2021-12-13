import React, { useEffect, useState } from "react";
import axios from "../../../api";
import axiosMain from "axios";
import Conversation from "./Conversation";

function ConversationsContainer() {
  //states
  const [conversations, setConversations] = useState([]);

  function onMessageSend(listener) {
    document.addEventListener("sendMessage", listener);
  }
  function offMessageSend(listener) {
    document.removeEventListener("sendMessage", listener);
  }

  function moveRecentConversationToTop(msg) {
    const message = msg.detail ? msg.detail : msg;
    setConversations((prevConversations) => {
      const index = prevConversations.findIndex((conversation) => {
        if (conversation?.with === message.recipient) {
          return true;
        }
        return false;
      });
      const recentConversation = prevConversations.splice(index, 1)[0];
      prevConversations.splice(0, 0, recentConversation);
      return [...prevConversations];
    });
  }

  async function getConversations(source) {
    axios
      .get(`/conversations`, {
        cancelToken: source.token,
      })
      .then((res) => {
        setConversations(res.data);
      });
  }

  useEffect(() => {
    const CancelToken = axiosMain.CancelToken; //axiosMain is axios
    const source = CancelToken.source();
    getConversations(source);
    onMessageSend(moveRecentConversationToTop);
    return () => {
      // Cancel request
      source.cancel();
      offMessageSend(moveRecentConversationToTop);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        marginTop: "0.5em",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      {conversations.map((conversation) => (
        <Conversation
          key={conversation._id}
          lastMessage={
            conversation.messages.length &&
            conversation.messages[conversation.messages.length - 1]
          }
          conversationWith={conversation.with}
        />
      ))}
    </div>
  );
}

export default ConversationsContainer;
