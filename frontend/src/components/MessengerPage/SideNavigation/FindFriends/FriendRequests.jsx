import React, { useEffect, useState } from "react";
import axios from "../../../../api";
import { Box, Typography } from "@material-ui/core";
import People from "../People";
import { PersonAdd } from "@material-ui/icons";

function FriendRequests({ update, changed }) {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await axios.get("/friendRequest");
      setFriendRequests(res.data);
      setLoading(false);
    })();
  }, [changed]);

  return (
    <Box my="1em" >
      <Typography variant="h6" align="center" color="primary">
        <PersonAdd style={{ marginRight: "0.5em" }} />
        Friend Requests
      </Typography>
      {!loading && friendRequests.length === 0 && (
        <Box px={5}>
          <Typography variant="body1" align="center" color="textSecondary">
            When you have friend requests or suggestions, you'll see them here.
          </Typography>
        </Box>
      )}
      {!loading &&
        friendRequests.length !== 0 &&
        friendRequests.map((Requester) => {
          return (
            <People
              key={Requester._id}
              person={Requester}
              type="request"
              update={update}
            />
          );
        })}
    </Box>
  );
}

export default FriendRequests;
