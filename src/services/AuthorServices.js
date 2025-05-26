import apiClient from "./services";

export default {
  getAuthors(userID) {
    return apiClient.get("authors?userId=" + userID);
  },
  addAuthor(author) {
    return apiClient.post("author/create", author);
  },
  updateAuthor(authorId, author) {
    return apiClient.put("author/" + authorId, author);
  },
  deleteAuthor(authorId) {
    return apiClient.delete("author/" + authorId);
  },
};
