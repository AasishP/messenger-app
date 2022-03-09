import {
  Box,
  makeStyles,
  Typography,
  useTheme,
  CircularProgress,
} from "@material-ui/core";
import { Description } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  mediaContainer: {
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
  },
  progressBarContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: "100%",
    width: "100%",
    borderRadius: "10px",
    background: "#000000b1",
  },
}));

function CircularProgressWithLabel(props) {
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    function updateProgress(progressEvent) {
      if (props.msgtempid === progressEvent.detail.msgTempId) {
        setProgressPercent(progressEvent.detail.amount);
      }
    }
    document.addEventListener("uploadProgress", updateProgress);
    return () => {
      document.removeEventListener("uploadProgress", updateProgress);
    };
  }, [props.msgtempid]);

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        value={progressPercent}
        variant="determinate"
        {...props}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          style={{ color: "white", fontSize: "1.3em" }}
        >{`${progressPercent}%`}</Typography>
      </Box>
    </Box>
  );
}

function Image({ image }) {
  const srcURL = image.secure_url || URL.createObjectURL(image);
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(srcURL);
    };
  }, [srcURL]);
  return (
    <img
      style={{
        objectFit: "cover",
        margin: "0.3em",
        width: "calc(100%/3 - 10px)",
        flexGrow: "1",
        maxHeight: "100px",
        borderRadius: "10px",
      }}
      src={srcURL}
      alt="msg-media"
    />
  );
}

function Video({ video }) {
  const srcURL = video.secure_url || URL.createObjectURL(video);
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(srcURL);
    };
  }, [srcURL]);
  return (
    <video
      style={{
        margin: "0.3em",
        width: "calc(100%/3 - 10px)",
        flexGrow: "1",
        maxHeight: "20vw",
        borderRadius: "10px",
      }}
      src={srcURL}
      controls={true}
    />
  );
}

function File({ file }) {
  const theme = useTheme();
  const classes = makeStyles((theme) => ({
    fileContainer: {
      display: "flex",
      alignItems: "center",
    },
    fileName: {
      maxWidth: "25vw",
      color: theme.palette.background.default,
    },
    fileIcon: {},
  }))();

  const fileName = file.name;
  const srcURL = file.secure_url || URL.createObjectURL(file);
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(srcURL);
    };
  }, [srcURL]);

  return (
    <div className={classes.fileContainer}>
      <Description
        className={classes.fileIcon}
        htmlColor={theme.palette.background.paper}
      />
      <Typography
        className={classes.fileName}
        variant="body1"
        noWrap
        component="a"
        href={srcURL}
        download={fileName}
      >
        {fileName}
      </Typography>
    </div>
  );
}

function MediaContent({ media, isUploading, msgTempId }) {
  const classes = useStyles();

  return (
    <Box className={classes.mediaContainer}>
      {isUploading && (
        <div className={classes.progressBarContainer}>
          <CircularProgressWithLabel size="5em" msgtempid={msgTempId} />
        </div>
      )}
      {media.images.map((image, index) => {
        return (
          <Image
            key={index}
            className={classes.image}
            image={image}
            alt="msg-media"
          />
        );
      })}
      {media.videos.map((video, index) => {
        return <Video key={index} video={video} />;
      })}
      {media.files.map((file, index) => {
        return (
          <File key={index} file={file} className={classes.fileContainer} />
        );
      })}
    </Box>
  );
}

export default MediaContent;
