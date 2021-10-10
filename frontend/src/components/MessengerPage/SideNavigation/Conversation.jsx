import {
  Avatar,
  Box,
  Badge,
  withStyles,
  Typography,
  ButtonBase,
} from "@material-ui/core";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import axios from "../../../api";
import SocketContext from "../../../context/SocketContext";
import theme from "../../../theme";

export const StyledBadge = withStyles(() => ({
  badge: {
    height: "0.9em",
    width: "0.9em",
    borderRadius: "50%",
    border: `2px solid #fff`,
    backgroundColor: ({ isonline }) => {
      return isonline ? "green" : "grey";
    },
  },
}))(Badge);

const styles = {
  buttonRipple: {
    color:theme.palette.primary.main,
  },
  main: {
    padding: "1em",
    width: "100%",
    justifyContent: "start",
    "&:hover": {
      transform: "scale(1.01)",
      boxShadow: "rgb(145 158 171 / 24%) 0px 5px 16px 0px",
    },
  },
};

const StyledButton = withStyles(styles)((props) => (
  <ButtonBase
    className={props.classes.main}
    TouchRippleProps={{ classes: { root: props.classes.buttonRipple } }}
    component="div"
  >
    {props.children}
  </ButtonBase>
));

function Conversation({ conversation }) {
  const history = useHistory();
  //context
  const socket = useContext(SocketContext);

  //states
  const [userInfo, setUserInfo] = useState({});
  const [recentMessage, setRecentMessage] = useState(
    conversation.messages[conversation.messages.length - 1]
  );
  const [online, setOnline] = useState(false);

  //custom events

  //add listener
  function onMessageSend(listener) {
    document.addEventListener("sendMessage", listener);
  }

  //remove listener
  function offMessageSend(listener) {
    document.removeEventListener("sendMessage", listener);
  }

  async function getUserInfo(username) {
    const res = await axios.get(`/userinfo/${username}`);
    setUserInfo(res.data);
  }

  //open messages
  function openMessages() {
    history.push(`/messenger/${conversation.with}`);
  }

  //format message timestamp
  function formatMessageTimestamp(timestamp) {
    return moment(timestamp)
      .fromNow(true)
      .replace(
        /a few seconds| hours| minutes| days|an hour|a day/gi,
        function (x) {
          switch (x) {
            case " hours":
              return "h";
            case " minutes":
              return "m";
            case " days":
              return "d";
            case "a few seconds":
              return "Just Now";
            case "a minute":
              return "1m";
            case "an hour":
              return "1h";
            case "a day":
              return "1d";
            default:
              return x;
          }
        }
      );
  }

  //useEffects

  useEffect(() => {
    //updateOnlineState
    function updateOnlineState(username, state) {
      username === userInfo?.username && setOnline(state);
    }

    socket.on("onlineStateChange", updateOnlineState);
    return () => {
      socket.off("onlineStateChange", updateOnlineState);
    };
  }, [socket, userInfo]);

  useEffect(() => {
    setOnline(userInfo.online);
  }, [userInfo.online]);

  useEffect(() => {
    //updateRecentMessage
    function updateRecentMessage(msg) {
      msg.from === conversation.with && setRecentMessage(msg);

      msg.detail?.recipient === conversation.with &&
        setRecentMessage(msg.detail); //in this case msg is the custom event object which contains the detail property which is the info passed during the dispatch of the event.
    }

    getUserInfo(conversation.with);

    socket.on("receive-message", updateRecentMessage);
    onMessageSend(updateRecentMessage);

    return () => {
      socket.off("receive-message", updateRecentMessage);
      offMessageSend(updateRecentMessage); //removeEventListener
    };
  }, [conversation, socket]);

  return (
    <StyledButton onClick={openMessages} component="div">
      <StyledBadge
        isonline={online ? 1 : 0}
        overlap="circle"
        badgeContent=""
        variant="dot"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Avatar alt={userInfo.username} src={userInfo.profilePic} />
      </StyledBadge>

      <Box px="0.8em">
        <Typography
          color="textPrimary"
          variant="h6"
          style={{ fontSize: "1.1rem" }}
        >
          {userInfo.firstName} {userInfo.lastName}
        </Typography>

        <Typography
          color={recentMessage.seen ? "textSecondary" : "textPrimary"}
          component="p"
          noWrap
          style={{
            width: "15.5rem",
            fontWeight: recentMessage.seen ? "normal" : "bold",
          }}
        >
          {recentMessage.from === userInfo.username
            ? `${userInfo.firstName}: `
            : "you: "}

          {/*message text */}
          {recentMessage.text}
        </Typography>
      </Box>

      <Box
        width={1}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Message time */}
        <Typography color="textSecondary" style={{ fontSize: "0.9rem" }}>
          {formatMessageTimestamp(recentMessage.timestamp)}
        </Typography>

        <Badge color="primary" variant="dot" />
      </Box>
    </StyledButton>
  );
}

export default Conversation;
