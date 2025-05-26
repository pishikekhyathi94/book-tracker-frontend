import apiClient from "./services";

export default {
  getGenres(userID) {
    return apiClient.get("genre?userId=" + userID);
  },
  addGenre(genre) {
    return apiClient.post("genre/create", genre);
  },
  updateGenre(genreId, genre) {
    return apiClient.put("genre/" + genreId, genre);
  },
  deleteGenre(genreId) {
    return apiClient.delete("genre/" + genreId);
  },
};
