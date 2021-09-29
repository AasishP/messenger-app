import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Slide,
  Typography,
} from "@material-ui/core";
import { Call, CallEnd, MicOff, VideoCall } from "@material-ui/icons";
import React, { useState } from "react";
import { createRef } from "react";
import theme from "../../../theme";

const useStyles = makeStyles({
  root: {
    width: "fit-content",
    padding: "1em",
    display: "flex",
    alignItems: "center",
    position: "absolute",
    top: "5px",
    left: "50%",
    transform: "translate(-50%)",
    zIndex: "2000",
    borderRadius: "20px",
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
      cursor: "move",
    },
  },

  avatar: {
    height: "2.5em",
    width: "2.5em",
  },
  button: {
    margin: "0 0.2em",
    backgroundColor: theme.palette.background.default,
    animation: "$vibrate 100ms infinite alternate ease-in-out",
  },
  username: {
    fontSize: "1.1rem",
  },
  discription: {
    fontSize: "0.9rem",
  },

  "@keyframes vibrate": {
    from: {
      transform: "rotateZ(-5deg) translateY(0px)",
    },
    to: {
      transform: "rotateZ(5deg) translateY(1px)",
    },
  },
});

function CallAlert({show}) {
  const classes = useStyles();
  //states
  const [mouseDown, setMouseDown] = useState(false);
  const alertRef = createRef(null);

  function DragHandler(e) {
    if (mouseDown) {
      const style = window.getComputedStyle(alertRef.current);
      alertRef.current.style.left = `${
        e.clientX - parseFloat(style.width) / 2
      }px`;
      alertRef.current.style.top = `${
        e.clientY - parseFloat(style.height) / 2
      }px`;
    }
  }

  function ActionButtons({ type }) {
    switch (type) {
      case "incomingAudioCall":
        return (
          <>
            <IconButton className={classes.button} onClick={() => {}}>
              <Call htmlColor={theme.palette.success.main} />
            </IconButton>
            <IconButton className={classes.button} onClick={() => {}}>
              <CallEnd htmlColor={theme.palette.error.main} />
            </IconButton>
          </>
        );
      case "incomingVideoCall":
        return (
          <>
            <IconButton className={classes.button} onClick={() => {}}>
              <VideoCall htmlColor={theme.palette.success.main} />
            </IconButton>
            <IconButton className={classes.button} onClick={() => {}}>
              <CallEnd htmlColor={theme.palette.error.main} />
            </IconButton>
          </>
        );
      case "ongoingVideoCall":
        return (
          <>
            <IconButton className={classes.button} onClick={() => {}}>
              <VideoCall htmlColor={theme.palette.success.main} />
            </IconButton>
            <IconButton className={classes.button} onClick={() => {}}>
              <CallEnd htmlColor={theme.palette.error.main} />
            </IconButton>
          </>
        );
      case "ongoingAudioCall":
        return (
          <>
            <IconButton className={classes.button} onClick={() => {}}>
              <MicOff htmlColor={theme.palette.grey} />
            </IconButton>
            <IconButton className={classes.button} onClick={() => {}}>
              <CallEnd htmlColor={theme.palette.error.main} />
            </IconButton>
          </>
        );
      default:
        return;
    }
  }

  return (
    <Slide direction="down" in={show} timeout={{ enter: 300, exit: 500 }}>
      <Box
        className={classes.root}
        boxShadow={5}
        ref={alertRef}
        onMouseDown={() => {
          setMouseDown(true);
        }}
        onMouseUp={() => {
          setMouseDown(false);
        }}
        onMouseLeave={() => {
          setMouseDown(false);
        }}
        onMouseMove={DragHandler}
      >
        <Avatar className={classes.avatar} alt="user" />
        <Box
          mx="1em"
          style={{
            "-webkit-user-select": "none" /* Chrome all / Safari all */,
            "-moz-user-select": "none" /* Firefox all */,
            "-ms-user-select": "none" /* IE 10+ */,
            "user-select": "none",
          }}
        >
          <Typography color="textSecondary" className={classes.discription}>
            Incoming Call...
          </Typography>
          <Typography color="textPrimary" className={classes.username}>
            Aasish
          </Typography>
        </Box>
        <ActionButtons type="ongoingAudioCall" />
      </Box>
    </Slide>
  );
}

export default CallAlert;
