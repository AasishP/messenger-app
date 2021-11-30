import { Box, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  videoContainer: {
    height: "100%",
    width: "100%",
    "&>video": {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
  },
  localVideoContainer: {
    position: "absolute",
    height: "20vh",
    top: "6em",
    right: "1em",
    backgroundColor: "white",
    "&>video": {
      height: "100%",
      width: "100%",
      objectFit: "contain",
    },
  },
});

function VideoContainer({ localVideo, remoteVideo }) {
  const classes = useStyles();
  return (
    <Box className={classes.videoContainer}>
      <Box className={classes.localVideoContainer}>
        <video ref={localVideo} autoPlay={true} muted={true} />
      </Box>
      <video ref={remoteVideo} autoPlay={true} />
    </Box>
  );
}

export default VideoContainer;
