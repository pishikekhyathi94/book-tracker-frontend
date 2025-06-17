import apiClient from "./services";

export default {
  getBooks(userId) {
    return apiClient.get("all/books?userId=" + userId+ "&type=all");
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
  checkBookNameExists(bookName) {
    return apiClient.get("title/book?title=" + bookName);
  },
   getRecommendations(userId) {
    return apiClient.get("books/recommendation?userId="+userId);
  },
  startedReading(readingValues) {
    return apiClient.put("book/reading?type=startreading", readingValues);
  },
  finishedReading(readingValues) {
    return apiClient.put("book/reading", readingValues);
  },
  rateBook(ratingValues) {
    return apiClient.post("rating", ratingValues);
  },
  rateUpdateBook(ratingValues, rating) {
    return apiClient.put("rating/" + rating, ratingValues);
  }
};
