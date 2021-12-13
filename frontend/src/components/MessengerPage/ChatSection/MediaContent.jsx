import { Box, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  mediaContainer: {
    display: "flex",
    flexWrap: "wrap",
  },
  image: {
    objectFit: "cover",
    margin: "0.3em",
    width: "calc(100%/4 - 10px)",
    flexGrow: "1",
    maxHeight: "100px",
    borderRadius: "10px",
  },
});

function MediaContent({media}) {
  const classes = useStyles();
  return (
    <Box className={classes.mediaContainer}>
      {media.images.map((image,index) => {
        return <img key={index} className={classes.image} src={image} alt="msg-media" />;
      })}
    </Box>
  );
}

export default MediaContent;
