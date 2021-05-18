import UserModel from "../models/user";
import { AuthenticationError } from "apollo-server-micro";
import jwt from "jsonwebtoken";
import { VariablesInAllowedPositionRule } from "graphql";

const getTokenID = async (token) => {

  try { 
    const { _id } = await jwt.verify(token,"shhh");
    return _id;
  } catch(err) {
    throw new AuthenticationError(err.message);
  }
}

const handleLogin = async ( user ) => {

  const userFound = await UserModel.findOne({ email: user.email });
  if (userFound) {
    if (userFound.password == user.password) {
      const token = await jwt.sign(
        {
          _id: userFound._id,
        },
        "shhh",
        { expiresIn: "1d" }
      );
      return { userID:userFound._id , jwt: token };
    } else {
      throw new AuthenticationError("Username or Password is Incorrect !");
    }
  } else {
    throw new AuthenticationError("Username or Password is Incorrect !");
  }
}

export const resolvers = {
  Query: {
    async getUser(_parent, _args, _context, _info) {
      const { _id } = _args;
      const user = await UserModel.findById(_id);
      return user;
    },
  },
  Mutation: {
    async register(_parent, _args, _context, _info) {
      const { user } = _args;
      const newUser = new UserModel({ ...user });
      const added = await newUser.save();
      return {userID:added._id};
    },
    async login(_parent, _args, _context, _info) {
      var payload = null; 
      try {
        if(_context.token){
          const id = await getTokenID(_context.token);
          payload =  {userID:id}
        } else {
          const {jwt,userID} = await handleLogin(_args.user);
          payload =  {userID,token:jwt}
        }
        return payload;
      } catch(err) {
        console.log(err.message);
         throw new AuthenticationError(err);
      } 
     
     
    },
  },
};
