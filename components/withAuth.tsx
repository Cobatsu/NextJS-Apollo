import React, { useEffect } from "react";
import { useMutation, useLazyQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

const LOGIN_MUTATION = gql`
  mutation Login($user: LoginInput) {
    login(user: $user) {
      userID
    }
  }
`;

const GET_USER_QUERY = gql`
  query User($_id: ID!) {
    getUser(_id: $_id) {
      firstName
      lastName
      email
    }
  }
`;

interface IUser {
  firstName: String;
  lastName: String;
  email: String;
}
type TUser = { user: IUser; pageProps: any };
type Private<T> = { component: React.FC<T>; pageProps: any };

const PrivateComponent: React.FC<Private<TUser>> = ({
  component: Component,
  pageProps,
}) => {
  const router = useRouter();
  const [login] = useMutation(LOGIN_MUTATION, {
    onError: () => {
      localStorage.removeItem("token");
      router.push("/login");
    },
  });
  const [getUser, { data }] = useLazyQuery(GET_USER_QUERY);
  useEffect(() => {
    login()
      .then((response: any) => {
        const { data } = response;
        getUser({
          variables: {
            _id: data.login.userID,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return data ? <Component user={data.getUser} pageProps={pageProps} /> : null;
};
export const withAuth = (Component: React.FC<TUser>) => (props :any) =>
  <PrivateComponent component={Component} pageProps={props} />;
