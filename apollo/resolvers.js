import UserModel from '../models/user'

export const resolvers = {
  Query:{
    async getUser(_parent, _args, _context, _info) { 
       const { _id } = _args;
       const user = await UserModel.findById(_id)
       return user
    }

  },
  Mutation: {
    async register(_parent, _args, _context, _info) {
      const { user } = _args;
      const newUser = new UserModel({...user})
      const added = await newUser.save()
      return added;
    },
  },

}
