import { gql } from '@apollo/client'

export const typeDefs = gql`  

  type User {
    _id:ID!
    firstName:String!
    lastName:String!
    email:String!
    password:String!
  }

  input RegisterInput {
    firstName:String!
    lastName:String!
    email:String!
    password:String!
  }

  input LoginInput {
    email:String!
    password:String!
  }

  type Query {
    getUser(_id:ID!):User!
  }

  type Mutation {
    login(user:LoginInput!):User!
    register(user:RegisterInput!):User!
  }

`
