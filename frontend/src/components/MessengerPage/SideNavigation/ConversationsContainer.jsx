import React, { useEffect, useState } from "react";
import axios from "../../../api";
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
        if (conversation.with === message.recipient) {
          return true;
        }
        return false;
      });
      const recentConversation = prevConversations.splice(index, 1)[0];
      prevConversations.splice(0, 0, recentConversation);
      return [...prevConversations];
    });
  }

  async function getConversations() {
    const res = await axios.get(`/conversations`);
    setConversations(res.data);
  }
  useEffect(() => {
    getConversations();

    onMessageSend(moveRecentConversationToTop);

    return () => {
      offMessageSend(moveRecentConversationToTop);
    };
  }, []);
  return (
    <div
      style={{
        width: "100%",
        marginTop: "0.5em",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      {conversations.map((conversation) => (
        <Conversation key={conversation._id} conversation={conversation} />
      ))}

    </div>
  );
}

export default ConversationsContainer;
