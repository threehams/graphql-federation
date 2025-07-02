import { createYoga } from "graphql-yoga";
import SchemaBuilder from "@pothos/core";
import DirectivePlugin from "@pothos/plugin-directives";
import FederationPlugin from "@pothos/plugin-federation";

const builder = new SchemaBuilder<{
  DefaultFieldNullability: false;
}>({
  plugins: [DirectivePlugin, FederationPlugin],
  defaultFieldNullability: false,
});

const BookRef = builder.externalRef(
  "Book",
  builder.selection<{ id: string }>("id"),
  (entity) => {
    return entity;
  }
);

BookRef.implement({
  externalFields: (t) => ({
    msrp: t.float(),
  }),
  fields: (t) => ({
    id: t.exposeID("id"),
    price: t.float({
      requires: builder.selection<{ msrp: number }>("msrp"),
      resolve: (data) => {
        return data.msrp * 0.9;
      },
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => "hello, world!",
    }),
  }),
});

interface NextContext {
  params: Promise<Record<string, string>>;
}

const { handleRequest } = createYoga<NextContext>({
  schema: builder.toSubGraphSchema({}),
  graphqlEndpoint: "/api/prices/graphql",

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
