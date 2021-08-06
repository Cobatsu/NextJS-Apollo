const { gql } = require("@apollo/client");

module.exports.typeDefs = gql`
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Post {
    _id: ID!
    title:String!
    content:String!
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

  input PostInput {
    title:String!
    content:String!
    owner:ID!
  }

  type LoginReturn {
    userID: ID!
  }

  type RegisterReturn {
    userID: ID!
  }

  type Logout {
    result:String!
  }

  type Posts {
    postNumber:Int!
    posts:[Post!]!
  }

  type Query {
    getUser(_id: ID!): User!
    getPosts(owner:ID!,limit:Int!,skip:Int!) : Posts!
  }

  type Mutation {
    login(user: LoginInput): LoginReturn!
    createPost(post:PostInput!) :Post!
    register(user: RegisterInput!) : RegisterReturn!
    logout:Logout!
  }
  
`;
