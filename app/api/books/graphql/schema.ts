import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { booksDatabase } from "./database/booksDatabase";
import { usersBooksDatabase } from "./database/usersBooksDatabase";

const typeDefs = parse(/* GraphQL */ `
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.3"
      import: ["@key", "@shareable", "@requires", "@external", "@inaccessible"]
    )

  type Query {
    book(id: String!): Book
  }

  type User @key(fields: "id") {
    id: ID!
    books: BookConnection!
  }
  type BookConnection {
    edges: [BookEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type BookEdge @key(fields: "node { id }") {
    cursor: String!
    node: Book!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  """
  A book that can be read. May or may not require the Internet
  """
  type Book @key(fields: "id") {
    id: ID!
    msrp: Float! @inaccessible
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
        const bookEdges = usersBooksDatabase
          .filter((userBook) => userBook.userId === parent.id)
          .map(({ bookId }) => {
            return {
              node: booksDatabase.find((book) => book.id === bookId)!,
              cursor: bookId,
            };
          });
        return {
          edges: bookEdges,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: bookEdges[0]?.cursor,
            endCursor: bookEdges.at(-1)?.cursor,
          },
          totalCount: bookEdges.length,
        };
      },
    },
  },
});
