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
  type Query {
    user(id: String!): User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
  }
`);

const resolvers = {
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
};

const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

interface NextContext {
  params: Promise<Record<string, string>>;
}

const { handleRequest } = createYoga<NextContext>({
  schema,
  graphqlEndpoint: "/api/users/graphql",

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
