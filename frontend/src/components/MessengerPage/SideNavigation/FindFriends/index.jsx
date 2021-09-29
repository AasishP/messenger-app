import { Divider } from "@material-ui/core";
import React, { useState } from "react";
import FriendRequests from "./FriendRequests";
import PendingFriendRequests from "./PendingFriendRequests";
import PeopleYouMayKnow from "./PeopleYouMayKnow";

function FindFriends() {
  const [changed, setChanged] = useState();

  function update() {
    setChanged(Math.random());
  }
  return (
    <div
      style={{
        width: "100%",
        overflowY: "scroll",
      }}
    >
      <FriendRequests changed={changed} update={update} />
      <Divider variant="middle" />
      <PendingFriendRequests changed={changed} update={update} />
      <Divider variant="middle" />
      <PeopleYouMayKnow changed={changed} update={update} />
    </div>
  );
}

export default FindFriends;
