import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  IconButton,
  makeStyles,
  Popover,
  Typography,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { Clear, Done, PersonAdd } from "@material-ui/icons";
import axios from "../../../api";
import React, { useContext, useEffect, useState } from "react";
import theme from "../../../theme";
import { StyledBadge } from "./Conversation";
import { useHistory } from "react-router-dom";
import SocketContext from "../../../context/SocketContext";

const useStyles = makeStyles({
  button: {
    display: "flex",
    padding: "1em",
    alignItems: "center",
  },
});

function People({ person, type, update }) {
  const history = useHistory();
  const classes = useStyles();

  //context
  const socket = useContext(SocketContext);

  //states
  const [online, setOnline] = useState(person.online);

  useEffect(() => {
    //updateOnlineState
    function updateOnlineState(username, state) {
      username === person?.username && setOnline(state);
    }

    socket.on("onlineStateChange", updateOnlineState);
    return () => {
      socket.off("onlineStateChange", updateOnlineState);
    };
  }, [socket, person]);

  //open messages
  function openMessages() {
    if (!type) return history.push(`/messenger/${person.username}`);
  }

  //send FriendRequest
  async function sendFriendRequest() {
    try {
      await axios.post("/friendrequest", {
        username: person.username,
        type: "send",
      });
      update();
    } catch (err) {
      console.log(err);
    }
  }
  //accept FriendRequest
  async function acceptFriendRequest() {
    try {
      await axios.post("/friendrequest", {
        username: person.username,
        type: "accept",
      });
      update();
    } catch (err) {
      console.log(err);
    }
  }

  //reject FriendRequest
  async function rejectFriendRequest() {
    try {
      await axios.post("/friendrequest", {
        username: person.username,
        type: "reject",
      });
      update();
    } catch (err) {
      console.log(err);
    }
  }
  //cancel FriendRequest
  async function cancelFriendRequest() {
    try {
      await axios.post("/friendrequest", {
        username: person.username,
        type: "cancel",
      });
      update();
    } catch (err) {
      console.log(err);
    }
  }

  //unFriend
  async function unFriend() {
    try {
      await axios.post("/friendrequest", {
        username: person.username,
        type: "unfriend",
      });
      console.log("unfriend");
      update();
    } catch (err) {
      console.log(err);
    }
  }

  function getButton(type) {
    switch (type) {
      case "request":
        return (
          <Box ml="auto">
            {/* accept Button */}
            <IconButton onClick={acceptFriendRequest}>
              <Done htmlColor={blue[600]} />
            </IconButton>

            {/* reject Button */}
            <IconButton onClick={rejectFriendRequest}>
              <Clear color="error" />
            </IconButton>
          </Box>
        );
      case "send":
        return (
          // add friend button
          <IconButton
            onClick={sendFriendRequest}
            style={{ marginLeft: "auto" }}
          >
            <PersonAdd />
          </IconButton>
        );
      case "pending":
        return (
          // cancle request button
          <Button
            variant="outlined"
            color="primary"
            onClick={cancelFriendRequest}
            style={{ marginLeft: "auto", textTransform: "capitalize" }}
          >
            Cancel
          </Button>
        );
      default:
        return <FriendUnFriendBtn unFriend={unFriend} />;
    }
  }
  return (
    <ButtonBase
      onClick={openMessages}
      className={classes.button}
      component="div"
    >
      <StyledBadge
        variant="dot"
        overlap="circle"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent=" "
        isonline={online ? 1 : 0}
      >
        <Avatar alt={person.firstName} src={person.profilePic} />
      </StyledBadge>
      <Box ml={2}>
        <Typography
          variant="h6"
          style={{ fontSize: "1.125rem" }}
          color="textPrimary"
        >
          {person.firstName} {person.lastName}
        </Typography>
      </Box>
      {getButton(type)}
    </ButtonBase>
  );
}

//button for friend type
function FriendUnFriendBtn({ unFriend }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "unfriend" : undefined;

  return (
    <>
      <Button
        aria-describedby={id}
        variant="outlined"
        color="primary"
        onClick={handleClick}
        style={{ marginLeft: "auto", textTransform: "capitalize" }}
      >
        Friends
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Button
          variant="outlined"
          onClick={unFriend}
          style={{
            marginLeft: "auto",
            textTransform: "capitalize",
            color: theme.palette.grey[700],
          }}
        >
          Unfriend
        </Button>
      </Popover>
    </>
  );
}

export default People;
