import axios from "../../../api";
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import People from "./People";

function FriendList() {
  const [friendList, setFriendList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function update() {
    const res = await axios.get("/friendlist");
    setFriendList(res.data);
    setLoading(false);
  }

  useEffect(() => {
    update();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        overflowY: "scroll",
      }}
    >
      {!loading && friendList.length === 0 && (
        <Box p={5}>
          <Typography variant="body1" align="center" color="textSecondary">
            You Have No Friends. Make Some to Start Messenging.
          </Typography>
        </Box>
      )}
      {!loading &&
        friendList.length !== 0 &&
        friendList.map((friend) => {
          return <People key={friend._id} person={friend} update={update} />;
        })}
    </div>
  );
}

export default FriendList;
