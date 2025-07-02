import {
  defineConfig,
  loadGraphQLHTTPSubgraph,
} from "@graphql-mesh/compose-cli";

export const composeConfig = defineConfig({
  subgraphs: [
    {
      sourceHandler: loadGraphQLHTTPSubgraph("users", {
        endpoint: "http://localhost:3000/api/users/graphql",
      }),
    },
    {
      sourceHandler: loadGraphQLHTTPSubgraph("books", {
        endpoint: "http://localhost:3000/api/books/graphql",
      }),
    },
    {
      sourceHandler: loadGraphQLHTTPSubgraph("prices", {
        endpoint: "http://localhost:3000/api/prices/graphql",
      }),
    },
  ],
});
