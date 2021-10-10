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
    // "&:hover": {
    //   cursor: "move",
    // },
  },

  call_animation: {
    width: "3em",
    height: "3em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: "50%",
    animation: "$play 2s ease infinite",
    webkitBackfaceVisibility: "hidden",
    mozBackfaceVisibility: "hidden",
    msBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
  },

  "@keyframes play": {
    "0%": {
      transform: " scale(1)",
    },
    "15%": {
      boxShadow:
        "0 0 0 3px" +
        (theme.palette.type === "dark" ? "#ffffff66" : "#aadff866"),
    },
    "25%": {
      boxShadow:
        " 0 0 0 5px" +
        (theme.palette.type === "dark" ? "#ffffff66" : "#aadff866") +
        ", 0 0 0 10px" +
        (theme.palette.type === "dark" ? "#ffffff33" : "#aadff833"),
    },
  },

  avatar: {
    height: "2.5em",
    width: "2.5em",
  },
  button_incoming: {
    margin: "0 0.2em",
    backgroundColor: theme.palette.background.default,
    animation: "$vibrate 100ms infinite alternate ease-in-out",
  },
  button: {
    margin: "0 0.2em",
    backgroundColor: theme.palette.background.default,
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

function CallAlert({ direction, callType }) {
  const classes = useStyles();
  //states
  const [mouseDown, setMouseDown] = useState(false);
  const alertRef = createRef(null);
  // const [showTimer, setShowTimer] = useState(false);

  // function DragHandler(e) {
  //   if (mouseDown) {
  //     const style = window.getComputedStyle(alertRef.current);
  //     alertRef.current.style.left = `${
  //       e.clientX - parseFloat(style.width) / 2
  //     }px`;
  //     alertRef.current.style.top = `${
  //       e.clientY - parseFloat(style.height) / 2
  //     }px`;
  //   }
  // }

  function AlertText() {
    switch (direction) {
      case "incoming":
        return <>Incoming call...</>;
      case "outgoing":
        return <>Calling...</>;
      default:
        return null;
    }
  }

  function ActionButtons() {
    const type = `${direction}${callType}`;
    switch (type) {
      case "incomingAudioCall":
        return (
          <>
            <IconButton
              className={classes.button_incoming}
              onClick={() => {
                console.log("call accepted");
                const callAccepted = new CustomEvent("callAccepted");
                document.dispatchEvent(callAccepted);
              }}
            >
              <Call htmlColor={theme.palette.success.main} />
            </IconButton>
            <IconButton className={classes.button_incoming} onClick={() => {}}>
              <CallEnd htmlColor={theme.palette.error.main} />
            </IconButton>
          </>
        );
      case "incomingVideoCall":
        return (
          <>
            <IconButton
              className={classes.button_incoming}
              onClick={() => {
                const callAccepted = new CustomEvent("callAccepted");
                document.dispatchEvent(callAccepted);
              }}
            >
              <VideoCall htmlColor={theme.palette.success.main} />
            </IconButton>
            <IconButton className={classes.button_incoming} onClick={() => {}}>
              <CallEnd htmlColor={theme.palette.error.main} />
            </IconButton>
          </>
        );
      case "outgoingAudioCall":
        return (
          <>
            <IconButton className={classes.button} onClick={() => {}}>
              <MicOff htmlColor={theme.palette.grey[500]} />
            </IconButton>
            <IconButton className={classes.button} onClick={() => {}}>
              <CallEnd htmlColor={theme.palette.error.main} />
            </IconButton>
          </>
        );
      case "outgoingVideoCall":
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
        return null;
    }
  }

  return (
    <Slide direction="down" in={true} timeout={{ enter: 300, exit: 500 }}>
      <Box
        className={classes.root}
        boxShadow={5}
        ref={alertRef}
        // onMouseDown={() => {
        //   setMouseDown(true);
        // }}
        // onMouseUp={() => {
        //   setMouseDown(false);
        // }}
        // onMouseLeave={() => {
        //   setMouseDown(false);
        // }}
        // onMouseMove={DragHandler}
      >
        <div className={classes.call_animation}>
          <Avatar className={classes.avatar} alt="user" />
        </div>

        <Box
          mx="1em"
          style={{
            WebkitUserSelect: "none" /* Chrome all / Safari all */,
            MozUserSelect: "none" /* Firefox all */,
            msUserSelect: "none" /* IE 10+ */,
            userSelect: "none",
          }}
        >
          <Typography color="textSecondary" className={classes.discription}>
            <AlertText />
          </Typography>
          <Typography color="textPrimary" className={classes.username}>
            Aasish
          </Typography>
        </Box>
        <ActionButtons />
      </Box>
    </Slide>
  );
}

export default CallAlert;
