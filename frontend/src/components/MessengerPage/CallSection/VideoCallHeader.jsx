import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import {
  Fullscreen,
  FullscreenExit,
  PictureInPictureAlt,
} from "@material-ui/icons";
import React, { useState } from "react";
import theme from "../../../theme";

const useStyles = makeStyles({
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
});

function VideoCallHeader() {
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
        <Avatar className={classes.avatar} />
        <Box className={classes.wrapper}>
          <Typography variant="h6" className={classes.username}>
            Aashish Paudel
          </Typography>
          <Typography variant="subtitle2" className={classes.timer}>
            10:20
          </Typography>
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
        <IconButton className={classes.headerBtn}>
          <PictureInPictureAlt htmlColor="white" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default VideoCallHeader;
