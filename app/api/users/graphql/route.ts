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

type User = {
  id: string;
  name: string;
};

const UserType = builder.objectRef<User>("User").implement({
  description: "User",
  fields: (t) => ({
    name: t.exposeString("name"),
    id: t.exposeID("id"),
  }),
});

builder.asEntity(UserType, {
  key: builder.selection<{ id: string }>("id"),
  resolveReference: ({ id }) => {
    return database.find((user) => user.id === id);
  },
});

builder.queryType({
  fields: (t) => ({
    user: t.field({
      type: UserType,
      args: {
        id: t.arg.id(),
      },
      nullable: true,
      resolve: (parent, { id }) => {
        return database.find((user) => user.id === id);
      },
    }),
  }),
});

interface NextContext {
  params: Promise<Record<string, string>>;
}

const { handleRequest } = createYoga<NextContext>({
  schema: builder.toSubGraphSchema({}),
  graphqlEndpoint: "/api/users/graphql",

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
