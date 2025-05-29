import apiClient from "./services";

export default {
  getBooks() {
    return apiClient.get("all/books");
  },
  addBook(book) {
    return apiClient.post("create/book", book);
  },
  addBookToWhislist(bookValues) {
    return apiClient.post("wishlist/book", bookValues);
  },
};
