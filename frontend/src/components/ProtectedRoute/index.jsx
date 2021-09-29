import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import MessengerPage from "../MessengerPage";
import authenticateLoginToken from "./authenticateUser";

function ProtectedRoute({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const valid = await authenticateLoginToken();
        setLoggedIn(valid);//vaid object contains loggein in user 
        setChecked(true);
      } catch (err) {
        setError(err.response?.data || err.message);
      }
    })();
  }, []);

  if (error) {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { alert: { type: "error", message: error } },
        }}
      />
    );
  }

  if (checked && loggedIn) {
    return <MessengerPage user={loggedIn.user} />;
  }
  if (checked && !loggedIn) {
    return <Redirect to="/login" />;
  }
  return null;
}

export default ProtectedRoute;
