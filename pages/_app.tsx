import { ApolloProvider, gql } from "@apollo/client";
import "../styles/global.css";
import { AppContext } from "next/app";
import { useApollo, initializeApollo } from "../apollo/client";
import Router from "next/router";
import ProgressBar from "@badrap/bar-of-progress";

const AUTH_NO_REQUIRED_PAGES = ["/login","/register"];

const LOGIN_MUTATION = gql`
  mutation Login {
    login {
      userID
    }
  }
`;

const GET_USER_QUERY = gql`
  query User($_id: ID!) {
    getUser(_id: $_id) {
      firstName
      lastName
      _id
    }
  }
`;

const progress = new ProgressBar({
  size: 2,
  color: "#7f03fc",
  className: "bar-of-progress",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);


function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo();
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const { Component, ctx } = appContext as any;
  var pageProps = {};

  var apolloClient: any;

  if (typeof window == "undefined") {
    apolloClient = initializeApollo({}, ctx.req.cookies.token);
  } else {
    apolloClient = initializeApollo();
  }

  if (!AUTH_NO_REQUIRED_PAGES.includes(ctx.pathname)) {

    var user = null;

    try {
      let auth = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
      });

      let res = await apolloClient.query({
        query: GET_USER_QUERY,
        variables: {
          _id: auth.data.login.userID,
        },
      });
      user = res.data.getUser;
    } catch (err) {
      //
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({
        ctx,
        user,
        apolloClient,
      });
    }
  } else {
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
  }

  return {
    pageProps
  };
};

export default MyApp;
