import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  IconButton,
  makeStyles,
  Popover,
  Typography,
  withStyles,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { Clear, Done, PersonAdd } from "@material-ui/icons";
import axios from "../../../api";
import React, { useContext, useEffect, useState } from "react";
import { StyledBadge } from "./Conversation";
import { useHistory } from "react-router-dom";
import SocketContext from "../../../context/SocketContext";
import { useTheme } from "@material-ui/styles";

const useStyles = makeStyles({
  button: {
    display: "flex",
    padding: "1em",
    alignItems: "center",
  },
});

const styles = (theme) => ({
  buttonRipple: {
    color: theme.palette.primary.main,
  },
  main: {
    padding: "0.5em",
    width: "100%",
    justifyContent: "start",
    "&:hover": {
      transform: "scale(1.01)",
      boxShadow: "rgb(145 158 171 / 24%) 0px 5px 16px 0px",
    },
  },
});

const StyledButton = withStyles(styles)((props) => (
  <ButtonBase
    onClick={props.onClick}
    className={props.classes.main}
    TouchRippleProps={{ classes: { root: props.classes.buttonRipple } }}
    component="div"
  >
    {props.children}
  </ButtonBase>
));

function MutualFriendInformation({ person }) {
  const theme = useTheme();
  let info = "";
  switch (true) {
    case person.mutualFriends.length === 0:
      return null;
    case person.mutualFriends.length === 1:
      info = `${person.mutualFriends[0]} is mutual`;
      break;
    case person.mutualFriends.length === 2:
      info = `${person.mutualFriends[0]} and ${person.mutualFriends[1]} are mutual`;
      break;
    default:
      info = `${person.mutualFriends.length} mutual friends including ${person.mutualFriends[0]} and ${person.mutualFriends[1]}`;
      break;
  }

  return (
    <Typography variant="body2" style={{ color: theme.palette.grey[700] }}>
      {info}
    </Typography>
  );
}

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
      update();
    } catch (err) {
      console.log(err);
    }
  }

  //button for friend type
  function FriendUnFriendBtn({ unFriend }) {
    const theme = useTheme();
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

  function getButton(type) {
    switch (type) {
      case "request":
        return (
          <Box ml="auto" display="flex">
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
    <StyledButton
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
          style={{ fontSize: "1rem" }}
          color="textPrimary"
        >
          {person.firstName} {person.lastName}
        </Typography>
        {/* mutual friends information*/}
        {type ? <MutualFriendInformation person={person} /> : null}
      </Box>
      {getButton(type)}
    </StyledButton>
  );
}

export default People;
