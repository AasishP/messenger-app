import React from "react";
import { Box, Avatar, Typography, makeStyles } from "@material-ui/core";
import { useContext } from "react";
import LoggedInUserContext from "../../../context/LoggedInUserContext";

const useStyles = makeStyles({
  username: {
    fontWeight: "bolder",
    marginLeft: "0.5em",
  },
});

function UserWithAvatar({ setShowChangeProfilePicture }) {
  const classes = useStyles();
  const { LoggedInUser } = useContext(LoggedInUserContext);
  return (
    <Box display="flex" alignItems="center">
      <Avatar
        onClick={() => {
          setShowChangeProfilePicture(true);
        }}
        alt={LoggedInUser.username}
        src={LoggedInUser.profilePic}
      />
      <Typography className={classes.username} variant="h6" color="textPrimary">
        {LoggedInUser.firstName} {LoggedInUser.lastName}
      </Typography>
    </Box>
  );
}

export default UserWithAvatar;
