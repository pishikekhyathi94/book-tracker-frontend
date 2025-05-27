<script setup>
import { ref, watch, onMounted } from "vue";
import AuthorCard from "../components/AuthorCard.vue";
import AddAuthorDialog from "../components/AddAuthorDialog.vue";
import AuthorServices from "../services/AuthorServices.js";
import GenresList from "../components/GenresList.vue";
import AddGenreDialog from "../components/AddGenreDialog.vue";
import GenreServices from "../services/GenreServices.js";
import BookCard from "../components/BookCard.vue";
import AddBookDialog from "../components/AddBookDialog.vue";
import BookServices from "../services/BookServices.js";

const tab = ref(null);
const loading = ref(false);
const search = ref("");
const user = ref(null);
const bookData = ref([]);
const showAuthorDialog = ref(false);
const showGenreDialog = ref(false);
const authorCardRef = ref(null);
const genresListRef = ref(null);
const showAddBookDialog = ref(false);
const authors = ref([]);
const genres = ref([]);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user) {
    await fetchBooks();
    await getAuthors();
    await getGeners();
  }
});

watch(tab, async () => {
  search.value = "";
});

async function getAuthors(){
  try {
        const authorRes = await AuthorServices.getAuthors(user.value.id);
        authors.value = authorRes.data;
      } catch (e) {
        authors.value = [];
      }
}
async function getGeners(){
  try {
        const genreRes = await GenreServices.getGenres(user.value.id);
        genres.value = genreRes.data;
      } catch (e) {
        genres.value = [];
      }
}

async function createAuthor(values) {
  const payload = {
    ...values,
    userId: user.value.id,
  };
  await AuthorServices.addAuthor(payload)
    .then((response) => {
      if (authorCardRef?.value && authorCardRef?.value?.getAuthors) {
        authorCardRef.value.getAuthors();
        showAuthorDialog.value = false;
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = `${response?.data?.authorName} added successfully!`;
      }
    })
    .catch((error) => {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error?.response?.data?.message || "An error occurred while adding the author.";
    });
}

async function createGenre(values) {
  const payload = {
    ...values,
    userId: user.value.id,
  };
  await GenreServices.addGenre(payload)
    .then((response) => {
      if (genresListRef?.value && genresListRef?.value?.getGenres) {
        genresListRef.value.getGenres();
        showGenreDialog.value = false;
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = `${response?.data?.bookGenre} added successfully!`;
      }
    })
    .catch((error) => {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error?.response?.data?.message || "An error occurred while adding the genre.";
    });
}
function closeSnackBar() {
  snackbar.value.value = false;
}

async function fetchBooks() {
  loading.value = true;
  try {
    const response = await BookServices.getBooks();
    bookData.value = response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
  } finally {
    loading.value = false;
  }
}

async function createBook(bookValues) {
  const payload = {
    ...bookValues,
    userId: user.value.id,
  };
  await BookServices.addBook(payload)
    .then(async (response) => {
      if (response?.status === 200) {
        await fetchBooks();
        showAddBookDialog.value = false;
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = `${response?.data?.bookName} added successfully!`;
      }
    })
    .catch((error) => {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error?.response?.data?.message || "An error occurred while adding the book.";
    });
  showAddBookDialog.value = false;
}

</script>

<style>
.header-btn .v-btn__content {
  font-weight: 600;
}
</style>

<template>
  <v-card class="w-100 h-100">
    <v-row>
      <v-col cols="10">
        <v-tabs v-model="tab" align-tabs="left" color="secondary" class="mb-4 px-6">
          <v-tab :value="1">Books List</v-tab>
          <v-tab :value="4">Authors</v-tab>
          <v-tab :value="5">Genres</v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="2">
        <v-btn variant="outlined" @click="showAddBookDialog = true" v-if="tab === 1" class="my-2 header-btn"
          color="secondary">
          Add Book
        </v-btn>
        <v-btn variant="outlined" @click="showAuthorDialog = true" v-if="tab === 4" class="my-2 header-btn"
          color="secondary">
          Add Author
        </v-btn>
        <v-btn variant="outlined" @click="showGenreDialog = true" v-if="tab === 5" class="my-2 header-btn"
          color="secondary">
          Add Genre
        </v-btn>
      </v-col>
    </v-row>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item  :key="1" :value="1">
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
          single-line class="mb-4 px-6"></v-text-field>
        <v-container fluid>
          <v-row v-if="bookData && bookData.length">
            <BookCard v-for="book in bookData" :key="book.id" :book="book" :tab="tab" :loading="loading"
              @edit="openEditModal" @delete="openDeleteDialog" @reserve="reserve" />
          </v-row>
          <v-row v-else>
            <v-col cols="12" class="text-center py-10">
              <v-icon size="48" color="grey">mdi-book-off-outline</v-icon>
              <div class="text-h6 mt-2">No books found</div>
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>
       <v-tabs-window-item :key="2" :value="2">
        <v-container>
          <v-row>
            <v-col cols="12">
             <span>content coming soon</span>
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>
       <v-tabs-window-item :key="3" :value="3">
        <v-container>
          <v-row>
            <v-col cols="12">
              <span>content coming soon</span>
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item :key="4" :value="4">
        <v-container>
          <v-row>
            <v-col cols="12">
              <AuthorCard :tab="tab" ref="authorCardRef" />
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item :key="5" :value="5">
        <v-container>
          <v-row>
            <v-col cols="12">
              <GenresList :tab="tab" ref="genresListRef" />
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
    <AddBookDialog v-model="showAddBookDialog" :authors="authors" :genres="genres" @submit="createBook" />
    <AddAuthorDialog v-model="showAuthorDialog" @submit="createAuthor" />
    <AddGenreDialog v-model="showGenreDialog" @submit="createGenre" />
  </v-card>
  <v-snackbar v-model="snackbar.value" rounded="pill">
    {{ snackbar.text }}
    <template v-slot:actions>
      <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
