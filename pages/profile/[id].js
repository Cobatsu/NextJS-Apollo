import React from 'react'
import { initializeApollo } from '../../apollo/client'
import {gql} from '@apollo/client'

const GET_USER_QUERY = gql`

    query User($_id:ID!) {

        getUser(_id:$_id) {

            firstName
            lastName
            email

        }

    }

`

const Profile = ({user}) => {
    const { firstName, lastName, email } = user.data.getUser
    return <div style={{display:'flex',flexDirection:'column'}}>
        <span>{firstName}</span>
        <span>{lastName}</span>
        <span>{email}</span>
    </div> 
}

export async function getServerSideProps({ params }) {

    const apolloClient = initializeApollo()
    const user = await apolloClient.query({
      query: GET_USER_QUERY,
      variables:{
          _id:params.id
      }
    })
  
    return {
      props: {
        user
      },
    }
}

export default Profile;