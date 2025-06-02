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
  removeBookFromWhislist(bookId) {
    return apiClient.delete("wishlist/remove/book/" + bookId);
  },
   getWhislist(userId) {
    return apiClient.get("wishlist?userId="+userId);
  },
   deletebook(bookId) {
    return apiClient.delete("delete/book/" + bookId);
  },
  updateBook(bookId, book) {
    return apiClient.put("update/book/" + bookId, book);
  },
  searchBooks(bookName) {
    return apiClient.get("search/books?bookName=" + bookName);
  },
};
