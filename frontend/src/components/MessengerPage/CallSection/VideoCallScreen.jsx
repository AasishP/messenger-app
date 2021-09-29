import { Box, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  root: {
    postition: "absolute",
  },
});

function VideoCallScreen({streamSrc}) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <video src=""></video>
    </Box>
  );
}
