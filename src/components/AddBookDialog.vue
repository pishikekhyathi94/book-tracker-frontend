<script setup>
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import BookServices from "../services/BookServices";

const props = defineProps({
  modelValue: Boolean,
  authors: { type: Array, default: () => [] },
  genres: { type: Array, default: () => [] }   
});
const isBookNameExists = ref(false);
const emit = defineEmits(['update:modelValue', 'submit']);

const localBook = ref({
  bookName: '',
  bookDescription: '',
  bookCoverImage: '',
  onlineBuyingLink: "",
  onlinePDFLink: "",
  authorId: '',
  genreId: ''
});

function closeDialog() {
  emit('update:modelValue', false);
}

function submitBook() {
  if (
    !localBook.value.bookName ||
    !localBook.value.bookDescription ||
    !localBook.value.bookCoverImage ||
    !localBook.value.authorId ||
    !localBook.value.genreId ||
    !localBook.value.onlineBuyingLink ||
    !localBook.value.onlinePDFLink
  ) return;
  emit('submit', { ...localBook.value });
  localBook.value = { bookName: '', bookDescription: '', onlineBuyingLink: "",
    onlinePDFLink: "", bookCoverImage: '', authorId: '', genreId: '' };
     isBookNameExists.value = false;
  closeDialog();
}

async function checkBookNameExists() {
  isBookNameExists.value = false;
  if (!localBook.value.bookName) return;
  try {
    const exists = await BookServices.checkBookNameExists(
      localBook.value.bookName
    );
    console.log(exists, "69::");
    if (exists.status !== 200) {
      isBookNameExists.value = true;
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Book name already exists!";
    }else{
      isBookNameExists.value = false
    }
  } catch (e) {
    isBookNameExists.value = true;
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text =
      e?.response?.data?.message || "Error checking book name.";
  }
}
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="600">
    <v-card>
      <v-card-title>Add Book</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="localBook.bookName"
          label="Book Name"
          outlined
          required
          @blur="checkBookNameExists"
        />
        <v-textarea
          v-model="localBook.bookDescription"
          label="Book Description"
          outlined
          required
        />
        <v-text-field
          v-model="localBook.bookCoverImage"
          label="Book Cover Image URL"
          outlined
          required
        />
        <v-text-field
          v-model="localBook.onlineBuyingLink"
          label="Online Buying Link"
          outlined
          required
        />
        <v-text-field
          v-model="localBook.onlinePDFLink"
          label="Online PDF Link"
          outlined
          required
        />
        <v-select
          v-model="localBook.authorId"
          :items="authors"
           item-title="authorName"
            item-value="id"
          label="Author"
          outlined
          required
        />
        <v-select
          v-model="localBook.genreId"
          :items="genres"
           item-title="bookGenre"
  item-value="id"
          label="Genre"
          outlined
          required
        />
      </v-card-text>
      <v-card-actions>
        <v-btn variant="flat" color="primary header-btn" :disabled="isBookNameExists" @click="submitBook">Submit</v-btn>
        <v-btn variant="outlined" color="secondary header-btn" @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>