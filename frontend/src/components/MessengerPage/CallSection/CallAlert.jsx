import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Slide,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Call, CallEnd, Mic, MicOff, VideoCall } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import { createRef } from "react";
import Timer from "./CallTimer";
// import Sounds from "./Sounds";
import { CALLSTATES } from "."; //STRING CONSTANTS

const useStyles = makeStyles((theme) => ({
  call_alert: {
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
  },

  //ripple animation around Avatar
  call_animation: {
    width: "3em",
    height: "3em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: "50%",
    animation: "$ripple 2s ease infinite",
    webkitBackfaceVisibility: "hidden",
    mozBackfaceVisibility: "hidden",
    msBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
  },

  "@keyframes ripple": {
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
  callerName: {
    fontSize: "1.1rem",
  },
}));

const useButtonStyles = makeStyles((theme) => ({
  button: {
    marginLeft: "0.2em",
    backgroundColor: theme.palette.background.default,
  },
  button_incoming: {
    margin: "0 0.2em",
    backgroundColor: theme.palette.background.default,
    animation: "$vibrate 100ms infinite alternate ease-in-out",
  },
  "@keyframes vibrate": {
    from: {
      transform: "rotateZ(-5deg) translateY(0px)",
    },
    to: {
      transform: "rotateZ(5deg) translateY(1px)",
    },
  },
}));

function CallStatus({ callState, callStartedTime }) {
  const theme = useTheme();
  const getTextColor = () => {
    switch (callState) {
      case CALLSTATES.CALLFAILED:
      case CALLSTATES.CONNECTIONLOST:
      case "hangup":
        return theme.palette.error.main;
      case CALLSTATES.NOANSWER:
      case CALLSTATES.BUSY:
        return theme.palette.warning.main;

      default:
        return theme.palette.text.secondary;
    }
  };
  return (
    <Typography
      style={{ color: getTextColor() || theme.palette.text.secondary }}
      variant="body1"
    >
      {console.log(callState)}
      {
        {
          connecting: "connecting. . .",
          connected: "connected",
          callFailed: "call Failed!",
          calling: "calling. . .",
          ringing: "Incoming Call. . .",
          noAnswer: "No Answer!",
          busy: "Busy!",
          ongoing: (
            <Timer callStartedTime={callStartedTime} callState={callState} />
          ),
          reconnecting: "Reconnecting. . .",
          connectionLost: (
            <span>
              <Timer callStartedTime={callStartedTime} callState={callState} />
              {"\tConnection Lost!"}
            </span>
          ),
          hangup: (
            <span>
              <Timer callStartedTime={callStartedTime} callState={callState} />
              {"\tcall Ended!"}
            </span>
          ),
        }[callState]
      }
    </Typography>
  );
}

function MicButton({ disabled, muted, setMuted }) {
  const theme = useTheme();
  const classes = useButtonStyles();
  return (
    <IconButton
      className={classes.button}
      disabled={disabled}
      onClick={() => {
        setMuted(!muted);
      }}
    >
      {muted ? (
        <MicOff htmlColor={theme.palette.grey[500]} />
      ) : (
        <Mic htmlColor={theme.palette.grey[500]} />
      )}
    </IconButton>
  );
}

function RecallButton({ callType, callingUser }) {
  const theme = useTheme();
  const classes = useButtonStyles();
  return (
    <IconButton
      className={classes.button_incoming}
      onClick={() => {
        const call = new CustomEvent("call", {
          detail: { callingUser, callType },
        });
        document.dispatchEvent(call);
      }}
    >
      <Call htmlColor={theme.palette.success.main} />
    </IconButton>
  );
}
function AcceptCallButton({ callType }) {
  const theme = useTheme();
  const classes = useButtonStyles();
  return (
    <IconButton
      className={classes.button_incoming}
      onClick={() => {
        const callAccepted = new CustomEvent("callAccepted");
        document.dispatchEvent(callAccepted);
      }}
    >
      {
        {
          AudioCall: <Call htmlColor={theme.palette.success.main} />,
          VideoCall: <VideoCall htmlColor={theme.palette.success.main} />,
        }[callType]
      }
    </IconButton>
  );
}

function EndCallButton() {
  const theme = useTheme();
  const classes = useButtonStyles();
  return (
    <IconButton
      className={classes.button}
      onClick={() => {
        const callEnd = new CustomEvent("callEnd");
        document.dispatchEvent(callEnd);
      }}
    >
      <CallEnd htmlColor={theme.palette.error.main} />
    </IconButton>
  );
}

function ActionButtons({ callType, callState, callingUser, muted, setMuted }) {
  switch (true) {
    case [
      CALLSTATES.CONNECTING,
      CALLSTATES.CONNECTED,
      CALLSTATES.CALLING,
      CALLSTATES.ONGOING,
      CALLSTATES.RECONNECTING,
    ].some((state) => state === callState):
      return (
        <>
          <MicButton
            disabled={callState !== CALLSTATES.ONGOING}
            muted={muted}
            setMuted={setMuted}
          />
          <EndCallButton />
        </>
      );

    case [
      CALLSTATES.CALLFAILED,
      CALLSTATES.NOANSWER,
      CALLSTATES.BUSY,
      CALLSTATES.CONNECTIONLOST,
    ].some((state) => state === callState):
      return <RecallButton callType={callType} callingUser={callingUser} />;

    case callState === CALLSTATES.RINGING:
      return (
        <>
          <AcceptCallButton callType={callType} />
          <EndCallButton />
        </>
      );
    default:
      return null;
  }
}

function CallAlert({
  direction,
  callType,
  callState,
  callingUser,
  remoteStream,
  localStream,
  callStartedTime,
}) {
  const classes = useStyles();
  //refs
  const alertRef = createRef(null);
  const audioRef = useRef();
  //states
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => (track.enabled = !muted)); //toggle mic
    }
  }, [muted, localStream]);

  useEffect(() => {
    if (remoteStream) {
      audioRef.current.srcObject = remoteStream;
      audioRef.current.play();
    }
  }, [remoteStream]);

  return (
    <Slide direction="down" in={true} timeout={{ enter: 200, exit: 500 }}>
      <Box className={classes.call_alert} boxShadow={5} ref={alertRef}>
        {remoteStream && <audio ref={audioRef} autoPlay={true} />}

        {/* <Sounds callState={callState} /> */}

        <div className={classes.call_animation}>
          <Avatar
            className={classes.avatar}
            src={callingUser.profilePic}
            alt="user"
          />
        </div>

        <Box
          mx="1em"
          style={{
            //makes text unselectable
            WebkitUserSelect: "none" /* Chrome all / Safari all */,
            MozUserSelect: "none" /* Firefox all */,
            msUserSelect: "none" /* IE 10+ */,
            userSelect: "none",
          }}
        >
          <CallStatus callState={callState} callStartedTime={callStartedTime} />

          <Typography color="textPrimary" style={{ fontSize: "1.1em" }}>
            {callingUser.firstName} {callingUser.lastName}
          </Typography>
        </Box>

        <ActionButtons
          callState={callState}
          callType={callType}
          direction={direction}
          muted={muted}
          setMuted={setMuted}
        />
      </Box>
    </Slide>
  );
}

export default CallAlert;
