const { ApolloServer } = require("apollo-server-micro");
const { schema } = require("../../apollo/schema");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const _Url =
  "";

export const config = {
  api: {
    bodyParser: false,
  },
};

mongoose
  .connect(_Url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err, "ERROR"));

const server = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    const token = req.cookies.token || req.headers.cookie;
   
    try {
      var { _id } = await jwt.verify(token, "shhh");
    } catch (err) {
      var _id = null;
    }
    return {
      userID: _id,
      req,
      res,
      token,
    };
  },
});

const handler = server.createHandler({ path: "/api/graphql" });

export default handler;
