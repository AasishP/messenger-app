import { Box, IconButton, TextField, makeStyles } from "@material-ui/core";
import { Attachment, Close, ImageRounded, Send } from "@material-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import SocketContext from "../../../context/SocketContext";

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
    display: "flex",
    flexWrap: "wrap",
    padding: "0.5em",
    maxHeight: "25vh",
    overflowY: "scroll",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "20%",
  },
  imageContainer: {
    position: "relative",
    width: "40px",
    height: "40px",
    marginRight: "0.8em",
    marginBottom: "0.8em",
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
    "&:hover": {
      transform: "scale(1.1)",
    },
    "&:active": {
      transform: "scale(1)",
    },
  },
});

function MessageInput({ updateMessages }) {
  const classes = useStyles();
  const Socket = useContext(SocketContext);
  //receipient
  const recipient = useParams().username;

  const [textFieldValue, setTextFieldValue] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [typing, setTyping] = useState("");

  //custom events
  function dispatchSendMessage(message) {
    const sendMessage = new CustomEvent("sendMessage", { detail: message });
    document.dispatchEvent(sendMessage); //firing sendMessage event.
  }

  useEffect(() => {
    switch (typing) {
      case "start":
        Socket.emit("typing", recipient, "start");
        break;
      case "stop":
        Socket.emit("typing", recipient, "stop");
        break;
      default:
        break;
    }
  }, [typing, recipient, Socket]);

  useEffect(() => {
    setTextFieldValue("");
  }, [recipient]);

  function sendMessage(e) {
    e.preventDefault();
    if (selectedImages.length > 0) {
      //this message object is only for showing in frontend which contains all medias in same message object
      const clientSideMsg = {
        recipient,
        text: textFieldValue,
        media: {
          images: selectedImages,
        },
      };
      updateMessages(clientSideMsg);
      dispatchSendMessage(clientSideMsg); //firing sendMessage event.
      setTyping("stop");
      setTextFieldValue("");
      setSelectedImages([]);

      Socket.emit(
        "sendingMediaMessage",
        {
          recipient,
          text: textFieldValue,
          mediaType: "image",
          mediaCount: selectedImages.length,
        },
        (token) => {
          //this is for uploding to server
          selectedImages.forEach((image) => {
            const message = {
              token,
              recipient,
              media: {
                image,
              },
            };
            Socket.emit("send-message", message);
          });
        }
      );

      return;
    }

    if (textFieldValue) {
      const message = {
        recipient,
        text: textFieldValue,
      };
      updateMessages(message);
      console.log("this ran");

      Socket.emit("send-message", message);

      dispatchSendMessage(message); //firing sendMessage event.
      setTyping("stop");
      setTextFieldValue("");
    }
  }

  function handleFileInputChange(e) {
    const images = [];
    Array.from(e.target.files).forEach((file) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.addEventListener("load", () => {
        images.push(fileReader.result);
        setSelectedImages([...images]);
      });
    });
  }

  function removeSelectedImage(index) {
    setSelectedImages((prev) => {
      prev.splice(index, 1);
      return [...prev];
    });
  }

  function handleTextFieldChange(e) {
    e.target.value ? setTyping("start") : setTyping("stop");
    setTextFieldValue(e.target.value);
  }
  return (
    <Box className={classes.root}>
      {selectedImages.length > 0 && (
        <Box className={classes.selectedItemsContainer}>
          {selectedImages.map((image, index) => {
            return (
              <div key={index} className={classes.imageContainer}>
                <button
                  className={classes.removeBtn}
                  onClick={() => {
                    removeSelectedImage(index);
                  }}
                >
                  <Close htmlColor="white" fontSize="inherit" />
                </button>
                <img
                  className={classes.selectedImage}
                  src={image}
                  alt="selected images"
                />
              </div>
            );
          })}
        </Box>
      )}

      <form className={classes.form} onSubmit={sendMessage}>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="image-btn"
          type="file"
          multiple
          onChange={handleFileInputChange}
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
          accept="application/pdf"
          style={{ display: "none" }}
          id="attachment-btn"
          type="file"
          multiple
          onChange={handleFileInputChange}
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

export default MessageInput;
