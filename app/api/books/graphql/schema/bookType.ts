import { builder } from "../builder";
import { Book, booksDatabase } from "../database/booksDatabase";

export const BookType = builder.objectRef<Book>("Book").implement({
  description: "A book that can be read. May or may not require the Internet",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    msrp: t.exposeFloat("msrp"),
  }),
});

builder.asEntity(BookType, {
  key: builder.selection<{ id: string }>("id"),
  resolveReference: ({ id }) => {
    return booksDatabase.find((book) => book.id === id);
  },
});
