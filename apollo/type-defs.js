import { gql } from '@apollo/client'

export const typeDefs = gql`  

  type User {
    _id:ID!
    firstName:String!
    lastName:String!
    email:String!
  }

  input RegisterInput {
    firstName:String!
    lastName:String!
    email:String!
  }

  type Query {

    getUser(_id:ID!):User!

  }

  type Mutation {
    register(user:RegisterInput!):User!
  }

`
