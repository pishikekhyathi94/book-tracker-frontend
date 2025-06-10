<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import BookDetails from "./BookDetails.vue";
import BookServices from "../services/BookServices.js";

const props = defineProps({
  book: { type: Object, required: true },
  user: { type: Object, required: true },
  tab: { type: [Number, String], default: 1 },
  loading: { type: Boolean, default: false },
  id: { type: [Number, String], default: null },
});

const isBookDetailsDialogOpen = ref(false);
const selectedBook = ref({});
const emit = defineEmits(['edit', 'delete', 'wishlistUpdated']);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

function openEdit() {
  emit('edit', props.book);
}
function openDelete() {
  emit('delete', props.book);
}
function viewDetails() {
  selectedBook.value = props.book;
  isBookDetailsDialogOpen.value = true;
}
async function whishlistBook() {
  try {
    await BookServices.addBookToWhislist({
      bookId: props.book.id,
      userId: props.user.id,
    }).then((response) => {
      if (response?.status === 200) {
        emit("wishlistUpdated");
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = `Book added to you whislist successfully!`;
      }
    });
  } catch (error) {
    snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error?.response?.data?.message || "Error adding book to wishlist.";
  }
}
async function removeWhishlistBook() {
  const bookId = props.tab === 1 ? props.book.wishlistId : props.id;
  try {
    await BookServices.removeBookFromWhislist(bookId).then((response) => {
      if (response?.status === 200) {
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = `Book removed from your wishlist successfully!`;
        emit("wishlistUpdated");
      }
    });
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error?.response?.data?.message || "Error removing book from wishlist.";
  }
}
function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<style>
.book-cover-image .v-img__img{
  object-fit: fill !important;
}
</style>

<template>
  <v-col cols="12" sm="6" md="4" lg="4">
  <v-card :disabled="loading" :loading="loading" class="mx-auto mb-6" max-width="374" hover>
      <template v-slot:loader="{ isActive }">
      <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate></v-progress-linear>
      </template>

    <v-img height="200" v-if="tab === 1 || tab === 2" :src="book?.bookCoverImage" class="book-cover-image"></v-img>

      <v-card-item>
      <v-card-title class="text-h5 font-weight-bold">{{ book?.bookName }}</v-card-title>
        <v-card-subtitle>
        <span class="me-1 font-weight-medium">{{ book?.bookGenre?.bookGenre || book?.bookGenre }}</span>
        </v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <v-row align="center" class="mx-0 mb-2 justify-space-between">
          <!-- <v-rating :model-value="book?.rating" color="amber" density="compact" size="small" half-increments readonly></v-rating> -->
          <div class="text-subtitle-1">
            <v-icon color="error" size="small">mdi-book-account-outline</v-icon>
            <span class="ms-1">{{ book?.bookAuthor?.authorName || book?.bookAuthor }}</span>
          </div>
        </v-row>
        <p class="text-justify overflow-y-auto" style="height: 100px">
        {{ book?.bookDescription || 'No description available.' }}
        </p>
      </v-card-text>
      <v-card-actions v-if="tab === 1 || tab === 2">
        <v-col cols="6" class="pa-0">
        <v-btn color="primary" text="View Details" border @click="viewDetails" class="header-btn"></v-btn>
        </v-col>
        <v-col cols="6" class="d-flex pa-0 justify-end">
          <v-btn
            color="red"
            v-if="tab === 1  && props.user.id === book.userId"
            icon="mdi-pencil-box-outline"
            size="large"
            @click="openEdit"
          ></v-btn>
          <v-btn
            v-if="tab === 2 || (tab === 1 && book.isWishlisted)"
            color="red"
            icon="mdi-heart"
            size="large"
            @click="removeWhishlistBook"
          ></v-btn>
          <v-btn
            v-if="tab === 1 && !book.isWishlisted"
            color="red"
            icon="mdi-heart-outline"
            size="large"
            @click="whishlistBook"
          ></v-btn>
          <v-btn
            v-if="tab === 1  && props.user.id === book.userId"
            color="red"
            icon="mdi-delete"
            @click="openDelete"
            size="large"
          ></v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-col>
   <BookDetails v-model="isBookDetailsDialogOpen" :book="selectedBook" />
  <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>