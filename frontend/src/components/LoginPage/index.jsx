import { Box, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import backgroundImage from "../../assets/loginPageBackground.svg";
import authenticateLoginToken from "../ProtectedRoute/authenticateUser";

const useStyle = makeStyles({
  root: {
    background: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPositionY: "100%",
  },
});

function LoginPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checked,setChecked] = useState(false);
  const classes = useStyle();
  const location = useLocation();

  // check if the user is already logged in.
  useEffect(() => {
    async function checkLoggedIn() {
      try{
      const isValid = await authenticateLoginToken();
      isValid && setLoggedIn(isValid);
      setChecked(true);
      } catch (err) {
        location.state={alert:{ type: "error", message: err.response?.data || err.message }}
        setChecked(true);
      }
    }
    checkLoggedIn();
  }, [location]);

  if (loggedIn) {
    return <Redirect to="/messenger" />;
  }
  if(!checked){
    return null
  }
  return (
    <Box
      className={classes.root}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
    >
      <Route exact path="/">
        <Redirect
          to={{
            pathname: "/login",
            state: location.state,
          }}
        />
      </Route>
      <Route path="/login">
        <LoginForm alert={location.state?.alert} />
      </Route>
      <Route path="/signup">
        <SignUpForm />
      </Route>
    </Box>
  );
}

export default LoginPage;
