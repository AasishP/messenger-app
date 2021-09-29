import { Box, FormHelperText } from "@material-ui/core";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import * as yup from "yup";
import axios from "../../api";
import {
  Form,
  PasswordField,
  SubmitButton,
  InputField,
  FormHeading,
  FormFooter,
} from "./InputFields";

//formik setUp
const initialValues = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
};
//form Submission
const onSubmit = async (values,{ setRegistered,setLoading, setFormError}) => {
  setLoading(true);
  try {
    const res = await axios.post("/register", values);
    if (res.status === 201) {
      setRegistered(true);
    }
  } catch (err) {
    console.log(err);
    setFormError({ state: true, message: err.response?.data || err.message})
    setLoading(false);
  }
};
//input validationSchema
const validationSchema = yup.object({
  firstName: yup
    .string()
    .required("firstName cannot be empty!")
    .min(3, "firstName must be at least 3 characters!")
    .max(255, "firstName cannot exceed 255 characters!")
    .matches(/[A-Za-z]{3,255}$/, "Invalid Characters!, use letters only."),
  lastName: yup
    .string()
    .required("lastName cannot be empty!")
    .min(3, "lastName must be at least 3 characters!")
    .max(255, "lastName cannot exceed 255 characters!")
    .matches(/[A-Za-z]{3,255}$/, "Invalid Characters!, use letters only."),
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

function SignUpForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({
    state: false,
    message: "",
  });
  const [registered, setRegistered] = useState(false);

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      onSubmit(values,{setRegistered, setLoading, setFormError});
    },
    validationSchema,
  });

  if(registered){
    return <Redirect to={{ pathname:"/login",state:{ alert:{type: 'success', message:"User Succesfully Registered!"}}}} />
  }

  return (
    <Form formik={formik}>
      <FormHeading>Lets Get Started.</FormHeading>

      {/* This is for Firstname and lastName input field */}
      <Box display="flex" justifyContent="space-between">
        <InputField name="firstName" formik={formik} />
        <div style={{ width: "1em" }}></div>
        <InputField name="lastName" formik={formik} />
      </Box>

      {/* This is for username input field */}
      <InputField name="username" formik={formik} />
      {/* This is for password Input Field */}
      <PasswordField
        passwordVisible={passwordVisible}
        setPasswordVisible={setPasswordVisible}
        formik={formik}
      />

      {/* error message  */}
      <FormHelperText error={formError.state}>
        {formError.message}
      </FormHelperText>

      <SubmitButton formik={formik} loading={loading}>
        Sign Up
      </SubmitButton>

      <FormFooter linkTo="/login" linkText="Sign In">
        Already have an account ?
      </FormFooter>
    </Form>
  );
}

export default SignUpForm;
