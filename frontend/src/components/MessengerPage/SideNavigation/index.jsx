import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import LogoutButton from "./LogoutButton";
import UserWithAvatar from "./UserWithAvatar";
import SelectionMenu from "./SelectionMenu";
import SearchBox from "./SearchBox/index.jsx";
import { useTheme } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
    minWidth: "400px",
    maxHeight: "100vh",
    [theme.breakpoints.down("sm")]: {
      minWidth: "100%",
    },
  },
}));

function SideNavigation({ setShowChangeProfilePicture }) {
  const theme = useTheme();
  const classes = useStyles();
  return (
    <Box
      className={classes.root}
      borderRight={`2px solid ${theme.palette.grey[200]}`}
    >
      <Box
        px={2}
        py={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <UserWithAvatar
          setShowChangeProfilePicture={setShowChangeProfilePicture}
        />
        <LogoutButton />
      </Box>
      <SearchBox />
      <SelectionMenu />
    </Box>
  );
}

export default SideNavigation;
