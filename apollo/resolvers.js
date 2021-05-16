import UserModel from "../models/user";
import { AuthenticationError } from "apollo-server-micro";
import jwt from "jsonwebtoken";

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
      return added;
    },
    async login(_parent, _args, _context, _info) {
      const { user } = _args;
      const userFound = await UserModel.findOne({ email: user.email });

      if (userFound) {
        if (userFound.password == _args.user.password) {
          const token = await jwt.sign(
            {
              username: userFound.username,
              email: userFound.email,
              _id: userFound._id,
            },
            "asdikjad",
            { expiresIn: "1d" }
          );
          return { ...userFound._doc, jwt: token };
        } else {
          throw new AuthenticationError("Username or Password is Incorrect !");
        }
      } else {
        throw new AuthenticationError("Username or Password is Incorrect !");
      }
    },
  },
};
