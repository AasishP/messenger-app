import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MessengerPage from "./components/MessengerPage";
import ProtectedRoute from "./components/ProtectedRoute";

const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#00ab55",
    },
    background: {
      paper: "#fff",
      default: "#fff",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path={["/", "/login", "/signup"]} exact>
            <LoginPage />
          </Route>
          <Route path="/messenger">
            <ProtectedRoute>
              <MessengerPage />
            </ProtectedRoute>
          </Route>
        </Switch>
      </ThemeProvider>
    </BrowserRouter>
  );
}
