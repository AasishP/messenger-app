import { Box, IconButton, makeStyles } from "@material-ui/core";
import {
  CallEnd,
  MicOff,
  VideocamOff,
} from "@material-ui/icons";
import React from "react";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    top: "100%",
    transform: "translateY(-100%)",
    marginTop: "-2em",
  },
  actionBtn: {
    height: "2.5em",
    width: "2.5em",
    margin: "0 0.8em",
    "&:nth-child(1),&:nth-child(2)": {
      backgroundColor: "#7c7c7c62",
      backdropFilter: "blur(5px)",
      webkitBackdropFilter: "blur(5px)",
    },
    "&:last-child": {
      backgroundColor: "#ff1100ab",
      backdropFilter: "blur(5px)",
      webkitBackdropFilter: "blur(5px)",
    },
  },
});



function ActionButtons() {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.ActionButtons}>
        <IconButton className={classes.actionBtn} onClick={() => {}}>
          <VideocamOff htmlColor="white" />
        </IconButton>
        <IconButton className={classes.actionBtn} onClick={() => {}}>
          <MicOff htmlColor="white" />
        </IconButton>
        <IconButton className={classes.actionBtn} onClick={() => {}}>
          <CallEnd htmlColor="white" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ActionButtons;
