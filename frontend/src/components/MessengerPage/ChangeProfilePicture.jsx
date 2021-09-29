import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  makeStyles,
  Modal,
  Typography,
} from "@material-ui/core";
import { Image, Publish } from "@material-ui/icons";
import React, { useContext, useState } from "react";
import axios from "../../api";
import theme from "../../theme";
import Alert from "../Utils/Alert";
import LoggedInUserContext from "../../context/LoggedInUserContext";

const useStyles = makeStyles({
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal__content: {
    height: "600px",
    width: "600px",
    borderRadius: "15px",
    backgroundColor: "#8585855a",
    backdropFilter: "blur(5px)",
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  avatar: {
    margin: "1em 0",
    height: "200px",
    width: "200px",
  },
  btnsContainer: {
    margin: "1.5em 0",
  },
  greetingText: {
    marginTop: "0.3em",
  },
  infoText: {
    fontSize: "1.2rem",
  },
  txtWhite: {
    color: "white",
  },
});

function ChangeProfilePicture({ greeting, setShowChangeProfilePicture }) {
  const classes = useStyles();
  const { LoggedInUser, setLoggedInUser } = useContext(LoggedInUserContext);

  //states
  const [profilePicture, setProfilePicture] = useState(LoggedInUser.profilePic);
  const [selectedImage, setSelectedImage] = useState();
  const [open, setOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState();

  const showProfilePicture = (e) => {
    const reader = new FileReader();
    e.target.files[0] && reader.readAsDataURL(e.target.files[0]); //This reads the file as urlencoded base64 string.
    reader.addEventListener("load", () => {
      setSelectedImage(reader.result);
      setProfilePicture(reader.result);
    });
  };

  async function uploadProfilePicture() {
    if (selectedImage) {
      try {
        setUploading(true); //start the loading spinner
        const res = await axios.post("/uploadprofilepic", {
          data: profilePicture,
        });
        setUploading(false); //stop the loading spinner
        setAlert({
          type: "success",
          message: res.data.message,
        });

        //update the profilePic property of the LoggedInUserContext
        setLoggedInUser((prev) => {
          const userInfo = { ...prev };
          userInfo.profilePic = res.data.profilePicURL;
          return userInfo;
        });
        /*
          alert completes at 2000 so waiting for alert to hide before closing/unmounting the modal.
          After 2000ms the showAlert state is set to false. So if the modal is closed/unmounted
          before the 2000ms, setState will be called after it. So error will occur 
          trying to setState of the component after unmount.
        */
        setTimeout(handleClose, 2100);
      } catch (err) {
        setAlert({
          type: "error",
          message: err.response?.data.message || err.message,
        });
        setUploading(false);
      }
    } else {
      setAlert({ type: "warning", message: "select image first" });
    }
  }

  function handleClose() {
    setOpen(false);
    setShowChangeProfilePicture && setShowChangeProfilePicture(false);
  }

  return (
    <>
      <Modal className={classes.modal} open={open}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          className={classes.modal__content}
        >
          {alert ? <Alert type={alert.type}>{alert.message}</Alert> : null}
          <Typography
            className={`${classes.txtWhite} ${classes.greetingText}`}
            variant="h3"
            align="center"
          >
            Hi! {LoggedInUser.firstName}
          </Typography>
          <Typography
            className={`${classes.txtWhite} ${classes.infoText}`}
            align="center"
          >
            {greeting ? (
              <>
                Welcome to Messenger.
                <br />
                Set your Profile Picture to continue.
              </>
            ) : (
              <>
                Click Choose To Select Your Profile Picture
                <br />
                And Upload To Set Your Profile Picture
              </>
            )}
          </Typography>
          <Avatar
            className={classes.avatar}
            src={profilePicture}
            alt="avatar"
          />
          <Typography className={classes.txtWhite} variant="h4" align="center">
            {LoggedInUser.firstName}
          </Typography>

          {uploading ? <CircularProgress size="2rem" /> : null}

          {/* Image upload Input */}
          <Box className={classes.btnsContainer}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={showProfilePicture}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                component="span"
                color="primary"
                endIcon={<Image />}
              >
                Choose
              </Button>
            </label>
            <Button
              onClick={uploadProfilePicture}
              style={{ marginLeft: "1em" }}
              variant="contained"
              component="span"
              color="primary"
              endIcon={<Publish />}
            >
              Upload
            </Button>
          </Box>

          {/* skip/close button */}
          <Button
            className={classes.btn}
            variant="contained"
            color="secondary"
            onClick={handleClose}
          >
            {greeting ? "Skip Now" : "Close"}
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default ChangeProfilePicture;
