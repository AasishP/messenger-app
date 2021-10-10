import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import LogoutButton from "./LogoutButton";
import UserWithAvatar from "./UserWithAvatar";
import SelectionMenu from "./SelectionMenu";
import Search from "./Search/index.jsx";
import theme from "../../../theme";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
    minWidth: "400px",
    maxHeight: "100vh",
  },
});

function SideNavigation({ setShowChangeProfilePicture }) {
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

      <Search />
      <SelectionMenu />
    </Box>
  );
}

export default SideNavigation;
