import { Avatar, Box, makeStyles, Typography } from "@material-ui/core";
import moment from "moment";
import React from "react";
import theme from "../../../theme";

const useStyles = makeStyles({
  avatar: {
    height: "2.4em",
    width: "2.4em",
  },
});

function Message({ children,timestamp,seen, messageType,userInfo }) {
  const classes = useStyles();
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
      <Typography variant="subtitle1" color="textSecondary" align="center">
        {moment(timestamp).fromNow()}
      </Typography>
      <Box
        display="flex"
        justifyContent={messageType === "to" ? "flex-end" : "flex-start"}
        mx="2em"
        my="0.5em"
        alignItems="center"
      >
        
          {messageType === "from"?<Avatar
            className={classes.avatar}
            alt={userInfo.username?.toUpperCase()}
            src={userInfo.profilePic}
          />: null}
        

        <Box
          maxWidth="60%"
          borderRadius={getBorderRadius(messageType)}
          boxShadow={7}
          bgcolor={getColor(messageType).background}
          mx="2em"
          p="1em"
        >
          <Typography
            component="p"
            variant="body1"
            style={{
              fontSize: "1.1rem",
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
