import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { createYoga } from "graphql-yoga";

type Book = {
  id: string;
  minAge: number;
};

const database: Book[] = [
  {
    id: "book1",
    minAge: 30,
  },
  {
    id: "book2",
    minAge: 10,
  },
];

const typeDefs = parse(/* GraphQL */ `
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.3"
      import: ["@key", "@external", "@requires"]
    )

  type Query {
    bookRecommendations: [Book!]!
  }

  type User @key(fields: "id") {
    id: ID!
    age: Int! @external
    bookRecommendations: [Book!]! @requires(fields: "age")
  }

  type Book @key(fields: "id") {
    id: ID!
  }
`);

const schema = buildSubgraphSchema({
  typeDefs,
  resolvers: {
    Book: {
      __resolveReference: (entity) => {
        return entity;
      },
    },
    User: {
      __resolveReference: (entity) => {
        return entity;
      },
      bookRecommendations: (parent, args) => {
        console.log(parent, args);
        return database.filter((book) => parent.age > book.minAge);
      },
    },
    Query: {
      bookRecommendations() {
        return database;
      },
    },
  },
});

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/recommendations/graphql",
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
