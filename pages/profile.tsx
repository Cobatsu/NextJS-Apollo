import React, { useState, useEffect, EventHandler } from "react";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import Router from "next/router";
import styles from "../styles/profile.module.css";
import { Formik, FormikProps } from "formik";
import Redirect from "../components/redirect";
import Link from "next/link";

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      result
    }
  }
`;

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($post: PostInput!) {
    createPost(post: $post) {
      title
      content
    }
  }
`;

const GET_POSTS_QUERY = gql`
  query GetPosts($owner: ID!, $skip: Int!, $limit: Int!) {
    getPosts(owner: $owner, skip: $skip, limit: $limit) {
      postNumber
      posts {
        title
        content
        _id
      }
    }
  }
`;

interface IUser {
  firstName: string;
  lastName: string;
}

const Logout = () => {
  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      Router.replace("/login");
    },
  });
  return (
    <button style={{ marginLeft: 10 }} onClick={() => logout()}>
      logout
    </button>
  );
};

const UserInformation = ({ firstName, lastName }: IUser) => {
  return (
    <div>
      <span>{firstName}</span>
      <span>{lastName}</span>
    </div>
  );
};

interface IPost {
  title: string;
  content: string;
  _id?: string;
}

const CreatePost = ({ owner, page }) => {
  const [post, { data, loading }] = useMutation(CREATE_POST_MUTATION, {
    onError: (err) => {
      console.log(err);
    },
  });
  const handleSubmitPost = async (values, { setErrors }) => {
    const response: any = await post({
      variables: {
        post: {
          ...values,
          owner,
        },
      },
    });

    setErrors({
      content: response.errors.message,
    });
  };
  return (
    <div className={styles.createPost}>
      <Formik
        initialValues={{ title: "", content: "" }}
        onSubmit={handleSubmitPost}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          errors,
        }: FormikProps<IPost>) => (
          <form
            onSubmit={handleSubmit}
            style={{
              marginTop: 20,
              display: "flex",
              flexDirection: "column",
              width: "10%",
              height: "90px",
              justifyContent: "space-around",
            }}
          >
            <input
              name="title"
              placeholder="title"
              onChange={handleChange}
              value={values.title}
            />
            <input
              name="content"
              placeholder="content"
              onChange={handleChange}
              value={values.content}
            />
            <button type="submit"> SEND THE POST </button>
            {errors.content ? (
              <span style={{ color: "red", marginLeft: 10 }}>
                {errors.content}
              </span>
            ) : null}
            {loading ? <span> loading... </span> : null}
            {!loading && data ? <span> added </span> : null}
          </form>
        )}
      </Formik>
    </div>
  );
};

interface IVariables {
  owner: string;
  limit: number;
  skip: number;
}

const useScroll = (): Array<any> => { 
  const [isScrollToBottom, setIsScrollToBottom] = useState<boolean>(false);

  useEffect(() => {
    const listElement = document.querySelector(".post-list");
    const handleScroll = (e: any) => {
      if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight) {
        setIsScrollToBottom(true);
      } else {
        setIsScrollToBottom(false);
      }
    };
    listElement.addEventListener("scroll", handleScroll);
    return () => listElement.removeEventListener("scroll", handleScroll);
  }, []);

  return [isScrollToBottom, setIsScrollToBottom];
};

const Posts = ({ postData: { posts, postNumber }, owner , page }) => {
  const [listPosts, setListPosts] = useState<Array<any>>(posts);
  const [isBottom, setIsBottom] = useScroll();
  const [loading, setLoading] = useState(false);
  const client = useApolloClient();
  let subPageNumber = Math.ceil(postNumber / 4);

  console.log(subPageNumber)

  const fetchMoreData = () => {
    setLoading(true);
    return client.query<any, IVariables>({
      query: GET_POSTS_QUERY,
      variables: {
        owner,
        limit: 6,
        skip: listPosts.length,
      },
    });
  };

  // useEffect(() => {
  //   if (isBottom) {
  //     fetchMoreData().then(({ data }) => {
  //       setIsBottom(false);
  //       setLoading(false);
  //       setListPosts((prev) => prev.concat(data.getPosts.posts));
  //     });
  //   }
  // }, [isBottom]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className={styles.list + " post-list"}>
        <h3>USER POSTS</h3>
        <h5
          style={{ padding: 0, margin: 0 }}
        >{`( ${postNumber} )  Result Found`}</h5>
        <ul style={{ padding: 0, margin: 0 }}>
          {posts.map((post: IPost) => {
            return (
              <li key={post._id}>
                <span>{post.title} </span>
                <span>{post.content}</span>
              </li>
            );
          })}
        </ul>
        {loading ? <span style={{ color: "green" }}>...loading</span> : null}
        <div style={{ display: "flex" , marginTop:10}}>
          {new Array(subPageNumber).fill(null).map((_, index) => {
            return (
              <button
                key={index}
                style={{
                  padding: 0,
                  width: 20,
                  height: 20,
                  marginRight: 5,
                  background: page == index + 1 ? "#bdd2b6" : "white",
                }}
              >
                <Link
                  href={{
                    href: "/profile",
                    query: { page: index + 1 }, // this object structure is more readable than string
                  }}
                >
                  <a className={styles.subButton}>{index + 1}</a>
                </Link>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Profile = ({ user, postData, page }) => {
  return (
    <div className={styles.wrapper}>
      <div style={{ display: "flex", justifyContent: "center", padding: 30 }}>
        <UserInformation {...user} />
        <Logout />
      </div>
      <CreatePost owner={user._id} page={page} />
      <Posts postData={postData} owner={user._id} page={page} />
    </div>
  );
};

Profile.getInitialProps = async ({ ctx, apolloClient, user }) => {
  // this is gonna be bundled in client size folder
  const { res , query } = ctx;
  console.log(query);
  if (!user) {
    Redirect(res, "/login");
    return {};
  } else {
    var posts = await apolloClient.query({
      query: GET_POSTS_QUERY,
      variables: {
        owner: user._id,
        skip: ( parseInt(query.page) - 1 ) * 6,
        limit: 6,
      },
    });

    return {
      user,
      postData: posts.data.getPosts,
      page:query.page
    };
  }
};

export default Profile;
