export type Book = {
  id: string;
  name: string;
  msrp: number;
};
export const booksDatabase: Book[] = [
  {
    id: "book1",
    name: "Max Power",
    msrp: 10,
  },
  {
    id: "book2",
    name: "Max Power 2: The Sequel",
    msrp: 12,
  },
];
