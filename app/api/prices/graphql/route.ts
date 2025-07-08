import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { createYoga } from "graphql-yoga";

const typeDefs = parse(/* GraphQL */ `
  type Query {
    noop: String
  }

  type Book @key(fields: "id") {
    id: ID!
    msrp: Float! @external
    price: Float! @requires(fields: "msrp")
  }
`);

const schema = buildSubgraphSchema({
  typeDefs,
  resolvers: {
    Query: {
      noop: () => {
        return "noop";
      },
    },
    Book: {
      __resolveReference(entity) {
        return entity;
      },
      price: (parent) => {
        return parent.msrp * 0.9;
      },
    },
  },
});

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/prices/graphql",
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
