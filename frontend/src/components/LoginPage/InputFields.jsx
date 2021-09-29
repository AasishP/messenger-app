import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const useStyles = makeStyles({
  form: {
    width: "70%",
    maxWidth: "450px",
    minWidth: "300px",
  },
  formTitle: {
    margin: "0.5em",
  },
  btn: {
    width: "fit-content",
    margin: "1.5em 0",
    padding: "0.7em 4em",
    textTransform: "capitalize",
  },
  link: {
    textDecoration: "none",
    alignSelf: "flex-end",
  },
  divider: {
    width: "100%",
    height: "1.5px",
    marginBottom: "1.5em",
  },
  spinner: {
    position: "absolute",
    right: "15%",
  },
});

const StyledTextField = withStyles({
  root: {
    "& .MuiInputBase-input": {
      padding: "0.7em",
    },
  },
})(TextField);

function Form({ formik, children }) {
  const classes = useStyles();
  return (
    <form onSubmit={formik.handleSubmit} className={classes.form}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p="2em 3em"
        bgcolor="white"
        boxShadow="rgb(37 117 252 / 20%) 0px 2px 20px 0px"
        borderRadius={10}
      >
        {children}
      </Box>
    </form>
  );
}

function FormHeading({ children }) {
  const classes = useStyles();
  return (
    <Typography
      className={classes.formTitle}
      variant="h5"
      color="primary"
      align="center"
    >
      {children}
    </Typography>
  );
}

function InputField({ formik, name, ...inputProps }) {
  return (
    <StyledTextField
      inputProps={inputProps}
      variant="outlined"
      fullWidth
      margin="normal"
      name={name}
      placeholder={name}
      aria-label={name}
      {...formik.getFieldProps(name)}
      error={Boolean(formik.touched[name] && formik.errors[name])}
      helperText={formik.touched[name] ? formik.errors[name] : ""}
    />
  );
}

function PasswordField({
  formik,
  passwordVisible,
  setPasswordVisible,
  ...inputProps
}) {
  return (
    <StyledTextField
      inputProps={inputProps}
      variant="outlined"
      fullWidth
      margin="normal"
      type={passwordVisible ? "text" : "password"}
      name="password"
      placeholder="Password"
      aria-label="password"
      {...formik.getFieldProps("password")}
      error={Boolean(formik.touched.password && formik.errors.password)}
      helperText={formik.touched.password ? formik.errors.password : ""}
      InputProps={{
        endAdornment: (
          <InputAdornment>
            <IconButton onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? (
                <Visibility color="primary" />
              ) : (
                <VisibilityOff color="primary" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

function SubmitButton({ children, formik, loading }) {
  const classes = useStyles();
  return (
    <Button
      type="submit"
      className={classes.btn}
      variant="contained"
      color="primary"
      aria-label="login button"
    >
      {children}
      {loading ? (
        <CircularProgress
          className={classes.spinner}
          color="inherit"
          size="1.5em"
        />
      ) : null}
    </Button>
  );
}

function FormFooter({ linkTo, children, linkText }) {
  const classes = useStyles();
  return (
    <>
      <Divider variant="middle" light={true} className={classes.divider} />
      <Typography variant="body2" color="textSecondary">
        {children}{" "}
        <Link to={linkTo} className={classes.link}>
          <Typography variant="inherit" color="primary" component="span">
            {linkText}
          </Typography>{" "}
        </Link>
        here!
      </Typography>
    </>
  );
}

export default StyledTextField;
export {
  useStyles,
  Form,
  FormHeading,
  InputField,
  PasswordField,
  SubmitButton,
  FormFooter,
};
