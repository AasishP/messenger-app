import { Box, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
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

function VideoCallScreen({
  localStream,
  remoteStream,
  callState,
  callingUser,
  callStartedTime,
}) {
  const classes = useStyles();
  const localVideo = useRef();
  const remoteVideo = useRef();
  const [muted, setMuted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  useEffect(() => {
    remoteVideo.current.srcObject = remoteStream;
    localVideo.current.srcObject = localStream;
  }, [remoteStream, localStream]);

  useEffect(() => {
    function toggleMic() {
      localStream.getAudioTracks().forEach((track) => (track.enabled = !muted));
    }
    toggleMic();
  }, [muted, localStream]);

  useEffect(() => {
    function toggleCamera() {
      localStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = cameraEnabled));
    }
    toggleCamera();
  }, [cameraEnabled, localStream]);

  return (
    <Box className={classes.root}>
      <VideoCallHeader
        callState={callState}
        callingUser={callingUser}
        callStartedTime={callStartedTime}
      />
      <VideoContainer localVideo={localVideo} remoteVideo={remoteVideo} />
      <ActionButtons
        muted={muted}
        cameraEnabled={cameraEnabled}
        setMuted={setMuted}
        setCameraEnabled={setCameraEnabled}
      />
    </Box>
  );
}

export default VideoCallScreen;
