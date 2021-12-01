import React, { useEffect } from "react";
import axios from "../../../../api";
import { Box, Typography } from "@material-ui/core";
import People from "../People";
import { useState } from "react";
import { HourglassEmptyOutlined } from "@material-ui/icons";

function PendingFriendRequests({update,changed}) {
  const [pendingFriendRequests, setPendingFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await axios.get("/friendRequest/pending");
      setPendingFriendRequests(res.data);
            setLoading(false);

    })();
  }, [changed]);

  return (
    <Box my="1em">
      <Typography variant="h6" align="center" color="primary">
        <HourglassEmptyOutlined />
        Pending Friend Requests
      </Typography>
      {!loading && pendingFriendRequests.length === 0 && (
        <Box px={5}>
          <Typography variant="body1" align="center" color="textSecondary">
            When you have pending friend requests, you'll see them here.
          </Typography>
        </Box>
      )}
      {!loading &&
        pendingFriendRequests.length !== 0 &&
        pendingFriendRequests.map((Requested) => {
          return (
            <People
              key={Requested._id}
              person={Requested}
              type="pendingRequest"
              update={update}
            />
          );
        })}
    </Box>
  );
}

export default PendingFriendRequests;
