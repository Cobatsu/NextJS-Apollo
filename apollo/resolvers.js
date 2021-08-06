const UserModel = require("../models/user");
const PostModel = require("../models/post");
const { AuthenticationError  } = require("apollo-server-micro");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const clearCookie = (res, name) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(name,"", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "strict",
      path: "/",
    })
  );
};

const setCookie = (res, name, token) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(name, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "strict",
      path: "/",
    })
  );
};

const getTokenID = async (token,res) => { 
  try  {
    const { _id } = await jwt.verify(token, "shhh");
    return _id;
  } catch(err) {
    clearCookie(res,'token')
    throw new AuthenticationError(err.message);
  }
};

const handleLogin = async (user, res) => {
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

      setCookie(res, "token", token);

      return userFound._id 
    } else {
      clearCookie(res,'token')
      throw new AuthenticationError("Username or Password is Incorrect !");
    }
  } else {
    clearCookie(res,'token')
    throw new AuthenticationError("Username or Password is Incorrect !");
  }
};

module.exports.resolvers = {
  Query: {
    async getUser(_parent, _args, _context, _info) {
      const { _id } = _args;
      const user = await UserModel.findById(_id);
      return user;
    },
    async getPosts(_parent, _args, _context, _info) {  
      const { owner , limit , skip } = _args;
     
      const allPosts = await PostModel.find({owner});
      const posts = await PostModel.find({owner}).limit(limit).skip(skip);
      return {postNumber:allPosts.length,posts};
    }
  },
  Mutation: {
    async register(_parent, _args, _context, _info) {
      const { user } = _args;
      const newUser = new UserModel({ ...user });
      const added = await newUser.save();
      return { userID: added._id };
    },
    async login(_parent, _args, _context, _info) {
      var { token,res } = _context;
      var id;
      try {
        if (!token) {
           id = await handleLogin(_args.user, res);
        } else {
           id = await getTokenID(token,res);
        }
        return {userID:id};
      } catch (err) {
        throw new AuthenticationError(err);
      }
    },
    async logout(_parent, _args, _context, _info) {
      const { res } = _context;
      clearCookie(res, "token"); // clears the cookie
      return {
        result: "logout",
      };
    },
    async createPost(_parent, _args, _context, _info) {
      const {post} = _args;
      if(!_context.userID) {
        clearCookie(_context.res,'token');
        throw new AuthenticationError("unauthorized");
      } else {
        const newPost = new PostModel({
          ...post
        });
        const postadded= await newPost.save();
        return postadded
      }   
    },
  },
};
