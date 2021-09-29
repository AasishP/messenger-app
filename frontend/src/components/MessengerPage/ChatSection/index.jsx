import { Box, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import MessagesContainer from "./MessagesContainer";
import theme from "../../../theme";
import { useParams } from "react-router";
import axios from "../../../api";

function ChatSection() {
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
      postition="relative"
      bgcolor={theme.palette.background.default}
    >
      <Header userInfo={userInfo} />
      <MessagesContainer userInfo={userInfo} />
    </Box>
  );
}

export default ChatSection;
