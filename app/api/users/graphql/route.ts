import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { createYoga } from "graphql-yoga";

type User = {
  id: string;
  name: string;
};

const database: User[] = [
  {
    id: "user1",
    name: "Blacklock",
  },
  {
    id: "user2",
    name: "Johnson",
  },
];

const typeDefs = parse(/* GraphQL */ `
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.3"
      import: ["@key", "@shareable", "@requires", "@external", "@inaccessible"]
    )

  type Query {
    user(id: String!): User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
  }
`);

const schema = buildSubgraphSchema({
  typeDefs,
  resolvers: {
    Query: {
      user(root, { id }) {
        return database.find((user) => user.id === id);
      },
    },
    User: {
      __resolveReference(entity) {
        return database.find((user) => user.id === entity.id);
      },
    },
  },
});

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/users/graphql",
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
