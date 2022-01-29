import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/wickedwick/d-cms",
    cache: new InMemoryCache(),
})

export default client
