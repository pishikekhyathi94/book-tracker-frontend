import apiClient from "./services";

export default {
  addBook(book) {
    return apiClient.post("create/book", book);
  },
};
