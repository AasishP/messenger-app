import { Box, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  container: {
    display: "flex",
    width: "fit-content",
    margin: "1em",
    padding: "0.5em",
    borderRadius: "10px 10px 10px 0",
  },
  dot: {
    height: "0.4em",
    width: "0.4em",
    margin: "0.2em",
    borderRadius: "50%",
    backgroundColor: "#00000055",
    "&:nth-child(1)": {
      animation: "$typing 600ms 200ms ease alternate backwards infinite",
    },
    "&:nth-child(2)": {
      animation: "$typing 600ms 400ms ease alternate backwards infinite",
    },
    "&:nth-child(3)": {
      animation: "$typing 600ms 600ms ease alternate backwards infinite",
    },
  },
  "@keyframes typing": {
    from: {
      opacity: "0.3",
      transform: "translateY(-50%) scale(1.1)",
    },
    to: {
      opacity: "1",
    },
  },
});

function TypingIndicator() {
  const classes = useStyles();
  return (
    <Box className={classes.container} boxShadow={5}>
      <div className={classes.dot}></div>
      <div className={classes.dot}></div>
      <div className={classes.dot}></div>
    </Box>
  );
}

export default TypingIndicator;
