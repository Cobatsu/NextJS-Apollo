import React, { useEffect } from "react";
import { useMutation, useLazyQuery, gql } from "@apollo/client";
import Router from "next/router";
import { initializeApollo } from "../apollo/client";
import { isTypeSubTypeOf } from "graphql";

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


export const withAuth  = <T,>(C: React.FC<T>) => {
  return class PrivateComponent extends React.Component {
    static async getInitialProps() {
      try {
        const apollo = initializeApollo();
        console.log(apollo);
        const loginResponse = await apollo.mutate({
          mutation: LOGIN_MUTATION,
        });

        const userResponse = await apollo.query({
          query: GET_USER_QUERY,
          variables:{
            _id:loginResponse.data.login.userID
          }
        });

        if (userResponse && userResponse.data && userResponse.data.getUser) {
          return {
            props: {
              user: userResponse.data.getUser,
            },
          };
        } else {

            return {
              props:{
                user:null
              }
            }
          
        }

      } catch(err){  
        
        console.log(err)
  
      }
    }

    render() {
      return <C {...this.props} />;
    }
  };
};

