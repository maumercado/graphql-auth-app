import { ApolloClient, HttpLink, InMemoryCache } from "apollo-client-preset";

const client = new ApolloClient({
    link: new HttpLink({
        uri: "/graphql",
        credentials: "same-origin"
    }),
    cache: new InMemoryCache({
        dataIdFromObject: o => o.id
    }),
    connectToDevTools: process.env.NODE_ENV !== "production"
});

export default client;
