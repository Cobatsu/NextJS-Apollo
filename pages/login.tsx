import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";
import styles from "../styles/register.module.css";
import { useRouter } from "next/router";
import { FieldProps, FormikHelpers } from "formik";
import { MyInput } from "../components/form";

const LOGIN_MUTATION = gql`
  mutation Login($user: LoginInput!) {
    login(user: $user) {
      token
      userID
    }
  }
`;

interface LoginI {
  email:String;
  password:String;
}

const Login = () => {
  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { token } = data.login;
      localStorage.setItem('token',token);
      router.push(`/profile`);
    },
  });

  const router = useRouter();

  const submitHandler = async (values, { setErrors }: FormikHelpers<any>) => {
    try {
      await login({
        variables: {
          user: {
            ...values,
          },
        },
      });
    } catch (err) {
      console.log(err);

      setErrors({
        password: "Unvalid Password Or Email !",
        email: "Unvalid Password Or Email !",
      });
    }
  };

  return (
    <div className={styles.formWrapper}>
      {" "}
      <Formik<LoginI>
        initialValues={{
         email:"",
         password:"",
        }}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("This Field Can Not Be Blank !"),
          password: Yup.string()
            .required("No password provided.")
            .min(8, " Should be 8 chars minimum. !"),
        })}
        onSubmit={submitHandler}
      >
        {({ handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit} className={styles.form}>
            <Field name="email" component={MyInput} placeholder="Email" />
            <Field
              name="password"
              type="password"
              component={MyInput}
              placeholder="Password"
            />
            <div className={styles.ButtonFields}>
              <button
                className={styles.SubmitButton}
                type="submit"
                disabled={isSubmitting}
              >
                {" "}
                LOGIN{" "}
              </button>

              <span onClick={()=>router.push('/register')} className={styles.AdditiveButton}>Don't have an account yet ?</span>
            </div>

          </form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
