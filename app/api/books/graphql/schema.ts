import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { booksDatabase } from "./database/booksDatabase";
import { usersBooksDatabase } from "./database/usersBooksDatabase";

const typeDefs = parse(/* GraphQL */ `
  type Query {
    book(id: String!): Book
  }

  type User @key(fields: "id") {
    id: ID!
    books: [Book!]!
  }

  """
  A book that can be read. May or may not require the Internet
  """
  type Book @key(fields: "id") {
    id: ID!
    msrp: Float!
    name: String!
  }
`);

export const schema = buildSubgraphSchema({
  typeDefs,
  resolvers: {
    Query: {
      book: () => {},
    },
    Book: {
      __resolveReference({ id }) {
        return booksDatabase.find((bookId) => bookId === id);
      },
    },
    User: {
      __resolveReference(entity) {
        return entity;
      },
      books: (parent) => {
        return usersBooksDatabase
          .filter((userBook) => userBook.userId === parent.id)
          .map(({ bookId }) => {
            return booksDatabase.find((book) => book.id === bookId)!;
          });
      },
    },
  },
});
