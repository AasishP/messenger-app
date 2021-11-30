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
import Alert from "../Utils/Alert";
import LoggedInUserContext from "../../context/LoggedInUserContext";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal__content: {
    height: "600px",
    width: "400px",
    borderRadius: "10px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  avatar: {
    margin: "1em 0",
    height: "170px",
    width: "170px",
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
  fullNameText: {
    marginTop: "1.5em",
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#2e2e2e",
  },
  usernameText: {
    marginTop: "0.3em",
    marginBottom: "0.8em",
    fontSize: "1.4rem",
    fontWeight: "500",
    color: "#2e2e2e",
  },
  btn: {
    margin: "0.5em 0",
    padding: "0.5em",
    width: "75%",
    "&:last-child": {
      margin: "3em 0",
    },
  },
}));

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
            className={classes.fullNameText}
            variant="h5"
            align="center"
          >
            {LoggedInUser.firstName} {LoggedInUser.lastName}
          </Typography>
          <Typography
            className={classes.usernameText}
            variant="h6"
            align="center"
          >
            @{LoggedInUser.username}
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
            ) : null}
          </Typography>
          <Avatar
            className={classes.avatar}
            src={profilePicture}
            alt="avatar"
          />

          {uploading ? <CircularProgress size="2rem" /> : null}

          {/* Image upload Input */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width={1}
            mt="auto"
            mb="2em"
          >
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={showProfilePicture}
            />

            <Button
              className={classes.btn}
              variant="contained"
              component="label"
              htmlFor="raised-button-file"
              color="primary"
              endIcon={<Image />}
            >
              Choose
            </Button>
            <Button
              className={classes.btn}
              onClick={uploadProfilePicture}
              variant="contained"
              component="span"
              color="primary"
              endIcon={<Publish />}
            >
              Upload
            </Button>

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
        </Box>
      </Modal>
    </>
  );
}

export default ChangeProfilePicture;
