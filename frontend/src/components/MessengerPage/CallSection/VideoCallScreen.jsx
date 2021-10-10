import { Box, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import ActionButtons from "./ActionButtons";
import VideoCallHeader from "./VideoCallHeader";
import VideoContainer from "./VideoContainer";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    zIndex: "1000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
});

function VideoCallScreen({ localStream, remoteStream }) {
  const classes = useStyles();
  const localVideo = useRef();
  const remoteVideo = useRef();

  useEffect(() => {
    remoteVideo.current.srcObject = remoteStream;
    localVideo.current.srcObject = localStream;
  }, [remoteStream, localStream]);

  return (
    <Box className={classes.root}>
      <VideoCallHeader />
      <VideoContainer localVideo={localVideo} remoteVideo={remoteVideo} />
      <ActionButtons />
    </Box>
  );
}

export default VideoCallScreen;
