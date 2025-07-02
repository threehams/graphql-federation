import { builder } from "../builder";
import { booksDatabase } from "../database/booksDatabase";
import { usersBooksDatabase } from "../database/usersBooksDatabase";
import { User } from "../types";
import { BookType } from "./bookType";

export const UserType = builder.objectRef<User>("User").implement({
  description: "A user which can own books",
  fields: (t) => ({
    id: t.exposeID("id"),
    books: t.field({
      type: [BookType],
      resolve: (parent) => {
        return usersBooksDatabase
          .filter((userBook) => userBook.userId === parent.id)
          .map(({ bookId }) => {
            return booksDatabase.find((book) => book.id === bookId)!;
          });
      },
    }),
  }),
});

builder.asEntity(UserType, {
  key: builder.selection<{ id: string }>("id"),
  resolveReference: ({ id }) => {
    return { id };
  },
});
