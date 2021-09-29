import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MessengerPage from "./components/MessengerPage";
import ProtectedRoute from "./components/ProtectedRoute";
import theme from "./theme";

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
