import {
  Avatar,
  Box,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core";
import moment from "moment";
import React from "react";
import MediaContent from "./MediaContent";

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: "2em",
    width: "2em",
  },
  timestamp: {
    marginTop: "4em",
  },
}));

function Message({ prevMsgTimestamp, msg, otherEndUser }) {
  const theme = useTheme();
  const classes = useStyles();

  const msgDirection = msg.from === otherEndUser.username ? "from" : "to";

  function showTimestamp() {
    const day = 8640000; //day in milliseconds
    const halfHour = 30 * 60 * 1000; //30 min in milliseconds (30min*60sec*100ms)
    const timeDifferenceBetweenMsg = moment(msg.timestamp).diff(
      moment(prevMsgTimestamp)
    );
    const timeDifferenceFromNow = moment().diff(moment(msg.timestamp));

    switch (true) {
      case timeDifferenceBetweenMsg < halfHour:
        return false;
      case timeDifferenceFromNow < halfHour:
        return moment(msg.timestamp).fromNow();
      case timeDifferenceFromNow < day:
        return moment(msg.timestamp).format("hh:mm A");
      case timeDifferenceFromNow < 7 * day:
        return `${moment(msg.timestamp).format("ddd")} at ${moment(
          msg.timestamp
        ).format("hh:mm A")}`;
      case timeDifferenceFromNow < 365 * day:
        return `${moment(msg.timestamp).format("MMM D")} at ${moment(
          msg.timestamp
        ).format("hh:mm A")}`;
      default:
        return `${moment(msg.timestamp).format("D MMM, YYYY")} at ${moment(
          msg.timestamp
        ).format("hh:mm A")}`;
    }
  }

  function getBorderRadius(msgDirection) {
    if (msgDirection === "to") {
      return "20px 0px 20px 20px";
    }
    return "0px 20px 20px 20px";
  }
  function getColor(msgDirection) {
    if (msgDirection === "to") {
      return {
        background: theme.palette.primary.main,
        text: theme.palette.getContrastText(theme.palette.primary.main),
      };
    }
    return theme.palette.background.paper;
  }
  return (
    <Box my="1em">
      {showTimestamp() ? (
        <Typography
          className={classes.timestamp}
          variant="subtitle1"
          color="textSecondary"
          align="center"
        >
          {showTimestamp()}
        </Typography>
      ) : null}

      <Box
        display="flex"
        justifyContent={msgDirection === "to" ? "flex-end" : "flex-start"}
        mx="1em"
        my="0.5em"
        alignItems="baseline"
      >
        {msgDirection === "from" && (
          <Avatar
            className={classes.avatar}
            alt={otherEndUser.username.toUpperCase()}
            src={otherEndUser.profilePic}
          />
        )}

        <Box
          maxWidth="60%"
          borderRadius={getBorderRadius(msgDirection)}
          boxShadow="rgb(145 158 171 / 24%) 0px 8px 16px 0px"
          bgcolor={getColor(msgDirection).background}
          mx={msgDirection === "from" ? "1em" : 0}
          p="1em"
        >
          <Typography
            component="p"
            variant="body1"
            style={{
              fontSize: "1.1rem",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              wordWrap: "break-word",
              color:
                msgDirection === "to"
                  ? getColor(msgDirection).text
                  : theme.palette.text.primary,
            }}
          >
            {msg.text}
          </Typography>
          {msg.media && console.log(msg)}
          {msg.media && <MediaContent media={msg.media} />}
        </Box>
      </Box>
    </Box>
  );
}

export default Message;
