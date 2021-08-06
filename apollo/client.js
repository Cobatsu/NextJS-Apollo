import { useMemo } from "react";
import { ApolloClient, InMemoryCache, from  } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "apollo-link-error";
import Router from 'next/router'

let apolloClient;


const errorLink = onError(({ graphQLErrors, networkError, operation }) => { // runs on both server and client side when any error occurs 
 
  if (graphQLErrors) {
    for (const el of graphQLErrors) {
      switch (el.extensions.code) {
        case "UNAUTHENTICATED":
          if(typeof window != "undefined") {
            Router.replace("/login"); //next router must be used in only client side
          } else {
            console.log("server")
          }
          break;
      }
    }
  }
});

function createLink(cookie) {
  const { HttpLink } = require("@apollo/client/link/http");
  return from([
    errorLink,
    new HttpLink({
      uri: "http://localhost:3000/api/graphql",
      credentials: "include",
      headers: {
        cookie,
      },
    }),
  ]);
}

function createApolloClient(cookie) {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: createLink(cookie),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = null, cookie) {
  const _apolloClient = apolloClient ?? createApolloClient(cookie);

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  if (typeof window === "undefined") return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
