import { gql } from "@apollo/client";

export const typeDefs = gql`
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginReturn {
    token: String!
    userID: ID!
  }

  type RegisterReturn {
    userID: ID!
  }


  type Query {
    getUser(_id: ID!): User!
  }

  type Mutation {
    login(user: LoginInput): LoginReturn!
    register(user: RegisterInput!) : RegisterReturn!
  }
  
`;
