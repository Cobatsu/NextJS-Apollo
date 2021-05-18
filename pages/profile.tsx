import React from "react";
import { initializeApollo } from "../apollo/client";
import { gql } from "@apollo/client";
import { GetServerSidePropsContext } from "next";
import {withAuth} from "../components/withAuth";

interface IUser {
  firstName: String;
  lastName: String;
  email: String;
}

const Profile: React.FC<any> = ({user}) => {

  return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{user.firstName}</span>
          <span>{user.lastName}</span>
          <span>{user.email}</span>
        </div>
  );
};

export default withAuth(Profile);
