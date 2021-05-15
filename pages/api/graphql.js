import { ApolloServer } from 'apollo-server-micro'
import { schema } from '../../apollo/schema'
import mongoose from 'mongoose'
const _Url = "mongodb+srv://Fatih:2231223122@cluster0.ftrtr.mongodb.net/NextJS-Apollo?retryWrites=true&w=majority"

mongoose.connect(_Url,{ useUnifiedTopology: true,useNewUrlParser: true })
.then(()=>console.log('connected to DB'))
.catch((err)=>console.log(err,"ERROR"));

const apolloServer = new ApolloServer({ schema })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: '/api/graphql' })
