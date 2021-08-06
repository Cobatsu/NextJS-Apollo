const { ApolloServer } =  require( "apollo-server-express");
const  { schema } = require ("./apollo/schema");
const mongoose = require ("mongoose");
const cors = require( "cors" ) ;
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();


const _Url = "mongodb+srv://Fatih:2231223122@cluster0.ftrtr.mongodb.net/NextJS-Apollo?retryWrites=true&w=majority";

var corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());

mongoose .connect(_Url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err, "ERROR"));

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ // we have to pass req and res objects to access in resolvers
    req,
    res,
  }),
});

server.applyMiddleware({ app, path: "/api/graphql" , cors:false});

app.listen({ port: 3000 } , ()=>{
    console.log("server is listening port 8000")
});
