import { createYoga } from "graphql-yoga";
import "./schema/queryType";
import "./schema/userType";
import "./schema/bookType";
import { schema } from "./schema";

interface NextContext {
  params: Promise<Record<string, string>>;
}

const { handleRequest } = createYoga<NextContext>({
  schema,
  graphqlEndpoint: "/api/books/graphql",

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
