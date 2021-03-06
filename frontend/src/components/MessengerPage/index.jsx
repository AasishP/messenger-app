import { Box, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ChatSection from "./ChatSection/index";
import SideNavigation from "./SideNavigation/index";
import ChangeProfilePicture from "./ChangeProfilePicture";
import config from "../../backendConfig";
import SocketContext from "../../context/SocketContext";
import LoggedInUserContext from "../../context/LoggedInUserContext";
import { Route } from "react-router";
import CallSection from "./CallSection";

function MessengerPage({ user }) {
  //setting up socket
  const socket = io(config.wsAddress, {
    auth: { token: localStorage.getItem("accesstoken") },
  });

  const theme = useTheme();
  const [showChangeProfilePicture, setShowChangeProfilePicture] =
    useState(false);

  const notMediumScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected!");
    });

    //clean up
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const [LoggedInUser, setLoggedInUser] = useState(user);
  const value = { LoggedInUser, setLoggedInUser };
  return (
    <SocketContext.Provider value={socket}>
      <LoggedInUserContext.Provider value={value}>
        <Box
          display="flex"
          minHeight={"100vh"}
          position="relative"
          bgcolor={theme.palette.background.default}
        >
          {user.newUser ? <ChangeProfilePicture greeting /> : null}

          {showChangeProfilePicture ? (
            <ChangeProfilePicture
              setShowChangeProfilePicture={setShowChangeProfilePicture}
            />
          ) : null}

          {notMediumScreen ? (
            <>
              <Route path="/messenger" exact>
                <SideNavigation
                  setShowChangeProfilePicture={setShowChangeProfilePicture}
                />
              </Route>
              <Route path="/messenger/:username" exact>
                <ChatSection />
              </Route>
            </>
          ) : (
            <>
              <SideNavigation
                setShowChangeProfilePicture={setShowChangeProfilePicture}
              />
              <Route path="/messenger/:username?">
                <ChatSection />
              </Route>
            </>
          )}

          <CallSection />
        </Box>
      </LoggedInUserContext.Provider>
    </SocketContext.Provider>
  );
}
export default MessengerPage;
