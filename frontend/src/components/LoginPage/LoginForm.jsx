import { FormHelperText, Typography } from "@material-ui/core";
import axios from "../../api";
import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Form,
  FormFooter,
  FormHeading,
  InputField,
  PasswordField,
  SubmitButton,
  useStyles,
} from "./InputFields";
import Alert from "../Utils/Alert";
import { useFormik } from "formik";
import * as yup from "yup";

//formik props set up
const initialValues = {
  username: "",
  password: "",
};

//form Submission
const onSubmit = async (values, { setLoggedIn, setLoading, setFormError }) => {
  setLoading(true);
  try {
    const res = await axios.post("/login", values);
    if (res.status === 200) {
      window.localStorage.setItem("accesstoken", res.data.accesstoken);
      setLoggedIn(true);
    }
  } catch (err) {
    setLoading(false);
    setFormError({ state: true, message: err.response?.data || err.message });
  }
};
//input validationSchema
const validationSchema = yup.object({
  username: yup
    .string()
    .required("username cannot be empty!")
    .min(4, "username must be at least 4 characters!")
    .max(255, "username cannot exceed 255 characters!")
    .matches(
      /[A-Za-z0-9._]{4,255}$/,
      "Only albabets dot(.) and underscore(_) is allowed!"
    ),
  password: yup
    .string()
    .trim()
    .required("password cannot be empty!")
    .min(6, "password must be least 6 characters long!")
    .max(255, "password cannot exceed 255 characters!")
    .matches(
      /[\S]{6,255}$/,
      "password cannnot contain white space characters!"
    ),
});

function LoginForm({ alert }) {
  const [formError, setFormError] = useState({
    state: false,
    message: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      onSubmit(values, { setLoggedIn, setLoading, setFormError });
    },
    validationSchema,
  });
  const classes = useStyles();

  if (loggedIn) {
    return <Redirect to="/messenger" />;
  }
  return (
    <>
      {alert ? <Alert type={alert.type}>{alert.message}</Alert> : null}

      <Form formik={formik}>
        {/* This is custom Form component. It is defined in InputFields.jsx */}
        <FormHeading>Welcome Back</FormHeading>

        {/*Username Field*/}
        <InputField name="username" formik={formik} autoFocus />

        {/*Password Field*/}
        <PasswordField
          formik={formik}
          passwordVisible={passwordVisible}
          setPasswordVisible={setPasswordVisible}
        />
        {/* error message  */}
        <FormHelperText error={formError.state}>
          {formError.message}
        </FormHelperText>

        {/*forget password*/}
        <Link to="/" className={classes.link}>
          <Typography variant="subtitle1" color="primary">
            Forget Password?
          </Typography>
        </Link>

        {/* sign in button */}
        <SubmitButton formik={formik} loading={loading}>
          Sign In
        </SubmitButton>

        <FormFooter linkTo="/signup" linkText="Sign Up">
          Don't have an account ?
        </FormFooter>
      </Form>
    </>
  );
}

export default LoginForm;
