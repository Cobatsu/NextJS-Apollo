import React from "react";
import { initializeApollo } from "../apollo/client";
import { gql } from "@apollo/client";
import { GetServerSidePropsContext } from "next";
import {withAuth} from "../components/withAuth";


const Profile = ({user,pageProps}) => {

  return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{pageProps.greeting}</span>
          <span>{user.firstName}</span>
          <span>{user.lastName}</span>
          <span>{user.email}</span>
        </div>
  );
};


export async function getServerSideProps(context) {
  return {
    props: {
      greeting:"HELLO"
    }, 
  }
}

export default withAuth(Profile);
