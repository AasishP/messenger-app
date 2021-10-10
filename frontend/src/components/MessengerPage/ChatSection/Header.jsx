import React, { useContext, useEffect } from "react";
import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { StyledBadge } from "../SideNavigation/Conversation";
import { MoreVert, Phone, VideoCall } from "@material-ui/icons";
import { useState } from "react";
import SocketContext from "../../../context/SocketContext";

const useStyles = makeStyles({
  header: {
    position: "absolute",
    backdropFilter:"blur(5px)",
    backgroundColor:"#ffffffc5",
    zIndex: "10",
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "1em 2em",
    borderRadius: "0 0 5px 5px",
    boxShadow: "rgb(145 158 171 / 24%) 0px 8px 16px 0px",
  },
  largeAvatar: {
    height: "2.5em",
    width: "2.5em",
  },
  buttonIcon: {
    margin: "0 0.7em",
  },
});

function Header({ userInfo }) {
  const classes = useStyles();
  //contexts
  const socket = useContext(SocketContext);

  //states
  const [online, setOnline] = useState(userInfo.online);

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

  function callHandler(callType) {
    const call = new CustomEvent("call", { detail: { userInfo, callType } });
    document.dispatchEvent(call);
  }

  return (
    <Box className={classes.header}>
      <StyledBadge
        variant="dot"
        badgeContent=" "
        overlap="circle"
        isonline={online ? 1 : 0}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Avatar
          className={classes.largeAvatar}
          alt={userInfo.username?.toUpperCase()}
          src={userInfo.profilePic}
        />
      </StyledBadge>
      <Box mx="1em">
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Typography variant="h6" color="textPrimary">
            {userInfo.firstName} {userInfo.lastName}
          </Typography>
          <Typography variant="subtitle1" color="textPrimary">
            {userInfo.username ? `@${userInfo.username}` : ""}
          </Typography>
        </Box>
      </Box>

      <Box mx="auto" mt="auto">
        <Typography variant="subtitle1" color="textSecondary">
          {online ? "Active Now" : "Offline"}
        </Typography>
      </Box>

      <Box ml="auto">
        <IconButton
          className={classes.buttonIcon}
          onClick={() => {
            callHandler("AudioCall");
          }}
        >
          <Phone fontSize="large" color="primary" />
        </IconButton>
        <IconButton
          className={classes.buttonIcon}
          onClick={() => {
            callHandler("VideoCall");
          }}
        >
          <VideoCall fontSize="large" color="primary" />
        </IconButton>
        <IconButton className={classes.buttonIcon}>
          <MoreVert fontSize="large" color="primary" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Header;
