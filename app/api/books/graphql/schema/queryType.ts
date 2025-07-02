import { builder } from "../builder";
import { booksDatabase } from "../database/booksDatabase";
import { BookType } from "./bookType";

builder.queryType({
  fields: (t) => ({
    book: t.field({
      type: BookType,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (_, { id }) => {
        return booksDatabase.find((book) => book.id === id);
      },
    }),
  }),
});
