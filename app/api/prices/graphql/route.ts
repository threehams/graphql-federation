import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { createYoga } from "graphql-yoga";

const typeDefs = parse(/* GraphQL */ `
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.3"
      import: ["@key", "@shareable", "@requires", "@external", "@inaccessible"]
    )

  type Query {
    noop: String
  }

  type Book @key(fields: "id") {
    id: ID!
    msrp: Float! @external
    price: Float! @requires(fields: "msrp")
  }
  type BookEdge @key(fields: "node { id }") {
    node: Book!
    hasIncentive: Boolean! @requires(fields: "node { msrp }")
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
    BookEdge: {
      __resolveReference(entity) {
        return entity;
      },
      hasIncentive: (parent) => {
        return parent.node.msrp > 11;
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
