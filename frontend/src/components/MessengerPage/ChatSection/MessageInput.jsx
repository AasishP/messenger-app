import {
  Box,
  IconButton,
  TextField,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core";
import {
  Attachment,
  Close,
  Description,
  ImageRounded,
  Send,
} from "@material-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";
import SocketContext from "../../../context/SocketContext";
import videoIconOverlay from "../../../assets/videoIconOverlay.png";
import axios from "../../../api/index";
import LoggedInUserContext from "../../../context/LoggedInUserContext";

const useStyles = makeStyles({
  root: {
    width: "60%",
    minWidth: "300px",
    marginTop: "auto",
    borderRadius: "20px",
    margin: "1.5em auto",
    padding: "1em",
    boxShadow: "rgb(145 158 171 / 24%) 0px 8px 16px 0px",
  },
  form: {
    display: "flex",
    alignItems: "center",
  },
  selectedItemsContainer: {
    padding: "0.5em",
    maxHeight: "25vh",
    overflowY: "scroll",
  },
  selectedMediasContainer: {
    display: "flex",
    flexWrap: "wrap",
  },
});

function seperateImagesAndVideos(medias) {
  const images = [];
  const videos = [];
  for (const media of medias) {
    const type = media.type.split("/")[0];
    type === "image" && images.push(media);
    type === "video" && videos.push(media);
  }
  if (images.length === 0 && videos.length === 0) return [null, null];
  return [images, videos];
}

class Message {
  constructor({
    from = "",
    recipient,
    images = [],
    videos = [],
    links = [],
    files = [],
    text = "",
  }) {
    this.tempMsgId = uuidv4();
    this.from = from;
    this.recipient = recipient;
    this.media = {
      images: images,
      videos: videos,
      links: links,
      files: files,
    };
    this.text = text;
    this.timestamp = new Date();
  }
}

function MessageInput({ updateMessages }) {
  const classes = useStyles();
  const Socket = useContext(SocketContext);
  const loggedInUser = useContext(LoggedInUserContext);
  const recipient = useParams().username;

  //states
  const [textFieldValue, setTextFieldValue] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileInputError, setFileInputError] = useState(false);
  const [typing, setTyping] = useState("");

  //custom events
  function dispatchSendMessage(message) {
    const sendMessage = new CustomEvent("sendMessage", { detail: message });
    document.dispatchEvent(sendMessage); //firing sendMessage event.
  }
  function dispatchUploadProgress(progress) {
    const uploadProgress = new CustomEvent("uploadProgress", {
      detail: progress,
    }); //{amount:Number,msgTempId}
    document.dispatchEvent(uploadProgress); //firing sendMessage event.
  }

  useEffect(() => {
    typing
      ? Socket.emit("typing", recipient, "start")
      : Socket.emit("typing", recipient, "stop");
  }, [typing, recipient, Socket]);

  useEffect(() => {
    //reset text field when the user is changed
    setTextFieldValue("");
  }, [recipient]);

  function handleTextFieldChange(e) {
    e.target.value ? setTyping(true) : setTyping(false);
    setTextFieldValue(e.target.value);
  }

  async function sendMessage(e) {
    e.preventDefault();

    //check if message input contains any content
    if (
      !(
        textFieldValue ||
        selectedImages.length > 0 ||
        selectedVideos.length > 0 ||
        selectedFiles.length > 0
      )
    ) {
      return;
    }

    if (
      selectedImages.length ||
      selectedVideos.length ||
      selectedFiles.length
    ) {
      //create new Message object for clientSide
      const messageForClientSide = new Message({
        from: loggedInUser.username,
        recipient,
        images: selectedImages,
        videos: selectedVideos,
        links: [],
        files: selectedFiles,
        text: textFieldValue,
      });

      //setting up formData
      const formData = new FormData();
      formData.append("recipient", recipient);
      formData.append("text", textFieldValue);

      selectedImages.forEach((image) => formData.append("images", image));
      selectedVideos.forEach((video) => formData.append("videos", video));
      selectedFiles.forEach((file) => formData.append("files", file));

      const config = {
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          dispatchUploadProgress({
            amount: percentCompleted,
            tempMsgId: messageForClientSide.tempMsgId,
          });
        },
      };

      /*
        getting response promise which will be added to clientSide message
        so that when response is received it can be used inside the message component
        to update the message.
      */
      const mediaMessageResponse = axios.post(
        "/sendMediaMessage",
        formData,
        config
      );

      mediaMessageResponse.then((response) => {
        const messageId = response.data._id;
        const recipientId = response.data.recipientId;
        Socket.emit("gotMediaMessaageResponse", messageId, recipientId);
      });

      messageForClientSide.mediaMessageResponse = mediaMessageResponse;

      dispatchSendMessage(messageForClientSide);
      updateMessages(messageForClientSide, recipient);

      //reset states
      setTextFieldValue("");
      setTyping(false);
      setSelectedImages([]);
      setSelectedVideos([]);
      setSelectedFiles([]);
    } else {
      const message = new Message({
        recipient,
        text: textFieldValue,
      });
      setTextFieldValue("");
      setTyping(false);
      updateMessages(message, recipient);
      Socket.emit("send-message", message);
      dispatchSendMessage(message);
    }
  }

  async function handleMediaInputChange(e) {
    const [images, videos] = seperateImagesAndVideos(e.target.files);
    if (!(images || videos)) {
      setFileInputError(true);
    } else {
      setSelectedImages(images);
      setSelectedVideos(videos);
    }
    e.target.value = "";
  }

  function handleFilesInputChange(e) {
    setSelectedFiles([...e.target.files]);
    e.target.value = "";
  }

  function removeSelectedImage(index) {
    setSelectedImages((prevImages) => {
      prevImages.splice(index, 1);
      return [...prevImages];
    });
  }
  function removeSelectedVideo(index) {
    setSelectedVideos((prevVideos) => {
      prevVideos.splice(index, 1);
      return [...prevVideos];
    });
  }

  function removeSelectedFile(index) {
    setSelectedFiles((prevFiles) => {
      prevFiles.splice(index, 1);
      return [...prevFiles];
    });
  }

  return (
    <Box className={classes.root}>
      {fileInputError && (
        <Typography variant="body2" color="error" align="center">
          Invalid file selected!
        </Typography>
      )}
      <Box className={classes.selectedItemsContainer}>
        {(selectedImages.length > 0 || selectedVideos.length > 0) && (
          <Box className={classes.selectedMediasContainer}>
            {selectedImages.map((image, index) => {
              return (
                <SelectedMediasPreviewer
                  media={image}
                  key={index}
                  removeSelectedMedia={removeSelectedImage}
                  index={index}
                />
              );
            })}
            {selectedVideos.map((Video, index) => {
              return (
                <SelectedMediasPreviewer
                  media={Video}
                  key={index}
                  removeSelectedMedia={removeSelectedVideo}
                  index={index}
                />
              );
            })}
          </Box>
        )}

        {selectedFiles.length > 0 && (
          <Box>
            {selectedFiles.map((file, index) => {
              return (
                <SelectedFilesPreviewer
                  file={file}
                  key={index}
                  removeSelectedFile={removeSelectedFile}
                  index={index}
                />
              );
            })}
          </Box>
        )}
      </Box>

      <form className={classes.form} onSubmit={sendMessage}>
        <input
          accept="image/*,video/*"
          style={{ display: "none" }}
          id="image-btn"
          type="file"
          multiple
          onChange={handleMediaInputChange}
        />
        <IconButton
          variant="contained"
          component="label"
          htmlFor="image-btn"
          color="primary"
        >
          <ImageRounded color="primary" />
        </IconButton>
        <input
          accept=".pdf,.txt,.zip,.docx,.xml"
          style={{ display: "none" }}
          id="attachment-btn"
          type="file"
          multiple
          onChange={handleFilesInputChange}
        />
        <IconButton
          variant="contained"
          component="label"
          htmlFor="attachment-btn"
          color="primary"
        >
          <Attachment color="primary" />
        </IconButton>
        <TextField
          fullWidth
          placeholder="Type something to send..."
          autoFocus
          aria-label="message input box"
          value={textFieldValue}
          onChange={handleTextFieldChange}
        />
        <IconButton type="submit">
          <Send color="primary" />
        </IconButton>
      </form>
    </Box>
  );
}

const useStyles_selectedMediaPreviewer = makeStyles({
  previewContainer: {
    position: "relative",
    width: "40px",
    height: "40px",
    marginRight: "0.8em",
    marginBottom: "0.8em",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "20%",
  },
  removeBtn: {
    all: "unset",
    position: "absolute",
    top: "-6px",
    right: "-6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "18px",
    width: "18px",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: "bold",
    backgroundColor: "#00000088",
    borderRadius: "50%",
    zIndex: "100",
    "&:hover": {
      transform: "scale(1.1)",
    },
    "&:active": {
      transform: "scale(1)",
    },
  },
  videoContainer: {
    position: "relative",
    width: "40px",
    height: "40px",
    marginRight: "0.8em",
    marginBottom: "0.8em",
    "&>video": {
      height: "100%",
      width: "100%",
      objectFit: "cover",
      borderRadius: "20%",
    },
    "&::before": {
      content: "''",
      backgroundImage: `url(${videoIconOverlay})`,
      backgroundPosition: "center",
      backgroundSize: "contain",
      height: "100%",
      width: "100%",
      position: "absolute",
      zIndex: "50",
    },
  },
});

function SelectedMediasPreviewer({ media, removeSelectedMedia, index }) {
  const classes = useStyles_selectedMediaPreviewer();
  const mediaObjectURL = URL.createObjectURL(media);

  return (
    <div className={classes.previewContainer}>
      <button
        className={classes.removeBtn}
        onClick={() => {
          URL.revokeObjectURL(mediaObjectURL);
          removeSelectedMedia(index);
        }}
      >
        <Close htmlColor="white" fontSize="inherit" />
      </button>

      {media.type.split("/")[0] === "image" ? (
        <img className={classes.selectedImage} src={mediaObjectURL} alt="img" />
      ) : (
        <div className={classes.videoContainer}>
          <video src={mediaObjectURL} />
        </div>
      )}
    </div>
  );
}

const useStyles_selectedFilePreviewer = makeStyles({
  selectedFilePreviewContainer: {
    display: "flex",
    alignItems: "center",
    padding: "1em",
  },
  fileIcon: {
    marginRight: "0.3em",
  },
  fileName: {
    width: "20vw",
  },
  removeBtn: {
    all: "unset",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "18px",
    width: "18px",
    margin: "auto 0.5em",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: "bold",
    backgroundColor: "#00000088",
    borderRadius: "50%",
    "&:hover": {
      transform: "scale(1.1)",
    },
    "&:active": {
      transform: "scale(1)",
    },
  },
});

function SelectedFilesPreviewer({ file, removeSelectedFile, index }) {
  const theme = useTheme();
  const classes = useStyles_selectedFilePreviewer();
  return (
    <div className={classes.selectedFilePreviewContainer}>
      <Description
        className={classes.fileIcon}
        htmlColor={theme.palette.primary.main}
      />
      <Typography className={classes.fileName} variant="body1" noWrap>
        {file.name}
      </Typography>
      <button
        className={classes.removeBtn}
        onClick={() => {
          removeSelectedFile(index);
        }}
      >
        <Close htmlColor="white" fontSize="inherit" />
      </button>
    </div>
  );
}

export default MessageInput;
