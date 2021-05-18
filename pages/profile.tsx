import React from "react";
import { initializeApollo } from "../apollo/client";
import { gql } from "@apollo/client";
import { GetServerSidePropsContext } from "next";
import { withAuth } from "../components/withAuth";

const Profile = ({ user }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>{user.firstName}</span>
      <span>{user.lastName}</span>
      <span>{user.email}</span>
    </div>
  );
};

type ObjWithChildren<T> = T & { children: string };

interface Test<T> {
  (obj: ObjWithChildren<T>): void;
}
type AdditionalProps = {
  name: string;
};
const test = () => {};

const hof = (fn: Test<AdditionalProps>) => {
  fn({
    name: "hello",
    children:"hello"
  });
};

//more test ............................
//hello

export default withAuth(Profile);
