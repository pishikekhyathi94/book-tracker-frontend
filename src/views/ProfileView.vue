<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import BookServices from "../services/BookServices";
import BookCard from "../components/BookCard.vue";
import ProfileServices from "../services/ProfileServices.js";

const router = useRouter();
const user = ref(null);
const searchQuery = ref("");
const userBooks = ref([]);
const loading = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

watch(searchQuery, async (val) => {
  if (val && val.length >= 3) {
    await searchBooks(val);
  } else {
    await fetchUserBooks();
  }
});

async function fetchUserBooks() {
  try {
    loading.value = true;
    const response = await ProfileServices.getMyBooks(user.value.id);
    userBooks.value = response.data;
  } catch (error) {
    snackbar.value = {
      value: true,
      color: "error",
      text: error?.response?.data?.message || "Failed to fetch user books.",
    };
  } finally {
    loading.value = false;
  }
}

async function searchBooks() {
  try {
    loading.value = true;
    const response = await BookServices.searchBooks(searchQuery.value);
    userBooks.value = response.data;
  } catch (error) {
    snackbar.value = {
      value: true,
      color: "error",
      text: error?.response?.data?.message || "Failed to search books.",
    };
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: "books" });
}

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem("user"));
  fetchUserBooks();
});
</script>

<template>
  <v-container>
    <!-- Header with Back Button -->
    <!-- <v-app-bar color="primary" dark>
      <v-toolbar-title>Profile</v-toolbar-title>
    </v-app-bar> -->

    <!-- Search Bar -->
    <v-row class="align-center">
      <v-col cols="2">
        <v-btn @click="goBack" variant="text" prepend-icon="mdi-check-circle">
          <template v-slot:prepend>
            <v-icon size="x-large">mdi-arrow-left</v-icon>
          </template>
          Book List
        </v-btn>
      </v-col>
      <v-col cols="10">
        <v-text-field
          v-model="searchQuery"
          label="Search Books"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          class="my-4"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row v-if="userBooks && userBooks.length">
      <BookCard
        v-for="book in userBooks"
        :book="book"
        :id="book.id"
        :key="book.id"
        :user="user"
        :tab="1"
      />
    </v-row>
    <v-row v-if="userBooks && userBooks.length === 0">
      <v-col cols="12" class="text-center py-10">
        <v-icon size="48" color="grey">mdi-book-off-outline</v-icon>
        <div class="text-h6 mt-2">No books found</div>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
