import { FieldProps } from "formik";
import React from "react";
import styles from "../styles/register.module.css";
import { TextField, InputAdornment } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";

export const MyInput = ({ field, form, ...props }: FieldProps) => {
  //This is for Field component's prop

  const anyError = form.errors[field.name] && form.touched[field.name];

  return (
    <TextField
      style={{ marginTop: 13 }}
      id="standard-error-helper-text"
      helperText={form.errors[field.name]}
      FormHelperTextProps={{ style: { color: "#f44336" } }}
      InputProps={{
        startAdornment: anyError ? (
          <InputAdornment position="start">
            <ErrorIcon style={{ color: "#f44336" }} />
          </InputAdornment>
        ) : null,
        autoComplete: 'off',
      }}
      variant="outlined"
      label={field.name}
      {...field}
      {...props}
      className={styles.formInput}
    />
  );
};
