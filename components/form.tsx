import { FieldProps } from "formik";
import React from "react";
import styles from "../styles/register.module.css";
import { TextField } from "@material-ui/core";

export const MyInput = ({ field, form, ...props }: FieldProps) => {
  //This is for Field component's prop

  const anyError = form.errors[field.name] && form.touched[field.name];

  return (
    <TextField
      style={{ marginTop: 13 }}
      id="standard-error-helper-text"
      helperText={form.errors[field.name]}
      error={anyError as boolean}
      variant="outlined"
      label={field.name}
      {...field}
      {...props}
      className={styles.formInput}
    />
  );
};
