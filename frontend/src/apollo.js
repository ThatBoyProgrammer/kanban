import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { createApolloProvider } from '@vue/apollo-option';

const httpLink = createHttpLink({ 
    uri: 'http://localhost:8000/graphql',
    credentials: 'include',
});

const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

const apolloProvider = createApolloProvider({
    defaultClient: apolloClient,
});

export { apolloClient, apolloProvider };
