import apiClient from "./services";

export default {
  getMyBooks(userId) {
    return apiClient.get("all/books?userId="+ userId);
  }
};
