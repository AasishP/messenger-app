import { Box, IconButton, makeStyles } from "@material-ui/core";
import {
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from "@material-ui/icons";
import React, { useRef } from "react";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    top: "100%",
    transform: "translateY(-100%)",
    marginTop: "-2em",
  },
  actionBtn: {
    height: "2.5em",
    width: "2.5em",
    margin: "0 0.8em",
    "&:nth-child(1),&:nth-child(2)": {
      backgroundColor: "#7c7c7c62",
      backdropFilter: "blur(5px)",
      webkitBackdropFilter: "blur(5px)",
    },
    "&:last-child": {
      backgroundColor: "#ff0000",
      backdropFilter: "blur(5px)",
      webkitBackdropFilter: "blur(5px)",
    },
  },
});

function ActionButtons({ muted, cameraEnabled, setMuted, setCameraEnabled }) {
  const classes = useStyles();
  const callEndRef = useRef(new Event("callEnd"));

  function endCall() {
    const callEnd = callEndRef.current;
    document.dispatchEvent(callEnd);
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.ActionButtons}>
        <IconButton
          className={classes.actionBtn}
          onClick={() => {
            setCameraEnabled(!cameraEnabled);
          }}
        >
          {cameraEnabled ? (
            <Videocam htmlColor="white" />
          ) : (
            <VideocamOff htmlColor="white" />
          )}
        </IconButton>
        <IconButton
          className={classes.actionBtn}
          onClick={() => {
            setMuted(!muted);
          }}
        >
          {muted ? <MicOff htmlColor="white" /> : <Mic htmlColor="white" />}
        </IconButton>
        <IconButton className={classes.actionBtn} onClick={endCall}>
          <CallEnd htmlColor="white" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ActionButtons;
