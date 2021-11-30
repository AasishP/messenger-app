import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Fullscreen, FullscreenExit } from "@material-ui/icons";
import React, { useState } from "react";
import { CALLSTATES } from ".";
import Timer from "./CallTimer";

const useStyles = makeStyles((theme) => ({
  videoCallHeader: {
    position: "absolute",
    zIndex: "1000",
    backgroundColor: "#7c7c7c62",
    backdropFilter: "blur(5px)",
    webkitBackdropFilter: "blur(5px)",
    width: "100%",
    padding: "0.8em",
    alignSelf: "stretch",
    display: "flex",
    justifyContent: "space-between",
  },
  userInfoContainer: {
    display: "flex",
    alignItems: "center",
    margin: "0 0.5em",
  },
  headerBtn: {
    margin: "0 0.5em",
  },
  wrapper: {
    color: "#fff",
    marginLeft: "1em",
  },
  timer: {
    color: theme.palette.grey[300],
  },
  avatar: {
    height: "2.3em",
    width: "2.3em",
  },
}));

function VideoCallHeader({ callState, callingUser, callStartedTime }) {
  const classes = useStyles();

  const [fullScreen, setFullScreen] = useState(false);

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullScreen(false);
      }
    }
  }

  return (
    <Box className={classes.videoCallHeader}>
      <Box className={classes.userInfoContainer}>
        <Avatar className={classes.avatar} src={callingUser.profilePic} />
        <Box className={classes.wrapper}>
          <Typography variant="h6" className={classes.username}>
            {callingUser.firstName} {callingUser.lastName}
          </Typography>
          {callState === CALLSTATES.ONGOING && (
            <Typography variant="subtitle2" className={classes.timer}>
              <Timer callStartedTime={callStartedTime} callState={callState} />
            </Typography>
          )}
        </Box>
      </Box>
      <Box className={classes.headerBtnsContainer}>
        <IconButton className={classes.headerBtn} onClick={toggleFullScreen}>
          {fullScreen ? (
            <FullscreenExit htmlColor="white" />
          ) : (
            <Fullscreen htmlColor="white" />
          )}
        </IconButton>
      </Box>
    </Box>
  );
}

export default VideoCallHeader;
