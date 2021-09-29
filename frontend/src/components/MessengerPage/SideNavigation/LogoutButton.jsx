import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Box,
  CircularProgress,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { PowerSettingsNew } from "@material-ui/icons";
import axios from "../../../api";

const useStyles = makeStyles({
  logoutText: {
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
});

function LogoutButton() {
  const classes = useStyles();
  const [loggedIn, setLoggedIn] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout(type) {
    try {
      setLoggingOut(true);
      const res = await axios.delete("/logout", {
        headers: { LogoutType: type}});
      if (res.status === 200) {
        window.localStorage.clear();
        setLoggedIn(false);
      }
    } catch (err) {
      setLoggingOut(false);
    }
  }

  if (!loggedIn) {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: {
            alert: { type: "success", message: "Succesfully LoggedOut!" },
          },
        }}
      />
    );
  }
  return (
    <>
      <Box display="flex" alignItems="center">
        <Typography className={classes.logoutText} color="textSecondary">
          Logout
        </Typography>
        <IconButton onClick={logout} size="small" aria-label="logout">
          {loggingOut ? <CircularProgress size="1em" /> : <PowerSettingsNew />}
        </IconButton>
      </Box>
    </>
  );
}

export default LogoutButton;
