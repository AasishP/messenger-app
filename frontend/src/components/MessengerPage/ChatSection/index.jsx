import { Box, Typography, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import MessagesContainer from "./MessagesContainer";
import { useParams } from "react-router";
import axios from "../../../api";

function ChatSection() {
  const theme = useTheme();
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (username) {
      (async () => {
        const res = await axios.get(`userinfo/${username}`);
        setUserInfo(res.data);
      })();
    }
  }, [username]);

  if (!username) {
    return (
      <Box
        display="flex"
        flexGrow="1"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h6" align="center" color="textSecondary">
          Open Chat To Start Messenging.
        </Typography>
      </Box>
    );
  }
  return (
    <Box
      width={1}
      style={{ height: "100vh" }}
      display="flex"
      flexDirection="column"
      position="relative"
      bgcolor={theme.palette.background.default}
    >
      <Header userInfo={userInfo} />
      <MessagesContainer otherEndUser={userInfo} />
    </Box>
  );
}

export default ChatSection;
