import { Avatar, Box, makeStyles, Typography } from "@material-ui/core";
import moment from "moment";
import React from "react";
import theme from "../../../theme";

const useStyles = makeStyles({
  avatar: {
    height: "2.4em",
    width: "2.4em",
  },
  timestamp: {
    marginTop: "4em",
  },
});

function Message({
  children,
  prevMsgTimestamp,
  timestamp,
  seen,
  messageType,
  userInfo,
}) {
  const classes = useStyles();

  function showTimestamp() {
    const day = 8640000; //day in milliseconds
    const halfHour = 30 * 60 * 1000; //30 min in milliseconds (30min*60sec*100ms)
    const timeDifferenceBetweenMsg = moment(timestamp).diff(
      moment(prevMsgTimestamp)
    );
    const timeDifferenceFromNow = moment().diff(moment(timestamp));

    switch (true) {
      case timeDifferenceBetweenMsg < halfHour:
        return false;
      case timeDifferenceFromNow < halfHour:
        return moment(timestamp).fromNow();
      case timeDifferenceFromNow < day:
        return moment(timestamp).format("hh:mm A");
      case timeDifferenceFromNow < 7 * day:
        return `${moment(timestamp).format("ddd")} at ${moment(
          timestamp
        ).format("hh:mm A")}`;
      case timeDifferenceFromNow < 365 * day:
        return `${moment(timestamp).format("MMM D")} at ${moment(
          timestamp
        ).format("hh:mm A")}`;
      default:
        return `${moment(timestamp).format("D MMM, YYYY")} at ${moment(
          timestamp
        ).format("hh:mm A")}`;
    }
  }

  function getBorderRadius(messageType) {
    if (messageType === "to") {
      return "20px 0px 20px 20px";
    }
    return "0px 20px 20px 20px";
  }
  function getColor(messageType) {
    if (messageType === "to") {
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
        justifyContent={messageType === "to" ? "flex-end" : "flex-start"}
        mx="2em"
        my="0.5em"
        alignItems="center"
      >
        {messageType === "from" ? (
          <Avatar
            className={classes.avatar}
            alt={userInfo.username?.toUpperCase()}
            src={userInfo.profilePic}
          />
        ) : null}

        <Box
          maxWidth="60%"
          borderRadius={getBorderRadius(messageType)}
          boxShadow="rgb(145 158 171 / 24%) 0px 8px 16px 0px"
          bgcolor={getColor(messageType).background}
          mx={messageType === "from"?"2em":0}
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
                messageType === "to"
                  ? getColor(messageType).text
                  : theme.palette.text.primary,
            }}
          >
            {children} {/*this is message */}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Message;
