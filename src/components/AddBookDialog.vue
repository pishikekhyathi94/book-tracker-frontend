<script setup>
import { ref, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';
import BookServices from "../services/BookServices";

const props = defineProps({
  modelValue: Boolean,
  authors: { type: Array, default: () => [] },
  genres: { type: Array, default: () => [] },
});

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const isBookNameExists = ref(false);
const emit = defineEmits(['update:modelValue', 'submit']);

const releaseDateMenu = ref(false);
const releaseDateObj = ref(null);
const localBook = ref({
  bookName: "",
  bookDescription: "",
  bookCoverImage: "",
  onlineBuyingLink: "",
  onlinePDFLink: "",
  authorId: "",
  releaseDate: null,
  genreId: "",
});

watch(releaseDateObj, (val) => {
  if (val instanceof Date) {
    const formatted = `${val.getFullYear()}-${String(val.getMonth() + 1).padStart(2, '0')}-${String(val.getDate()).padStart(2, '0')}`;
    if (localBook.value.releaseDate !== formatted) {
      localBook.value.releaseDate = formatted;
    }
  }
});
// watch(
//   () => localBook.value.releaseDate,
//   (val) => {
//     if (
//       val &&
//       typeof val === 'string' &&
//       !isNaN(Date.parse(val))
//     ) {
//       const parsed = new Date(val);
//       if (!releaseDateObj.value || parsed.getTime() !== releaseDateObj.value.getTime()) {
//         releaseDateObj.value = parsed;
//       }
//     }
//   },
//   { immediate: true }
// );

function closeDialog() {
  emit("update:modelValue", false);
}

function submitBook() {
  if (
    !localBook.value.bookName ||
    !localBook.value.bookDescription ||
    !localBook.value.bookCoverImage ||
    !localBook.value.authorId ||
    !localBook.value.genreId ||
    !localBook.value.onlineBuyingLink ||
    !localBook.value.onlinePDFLink ||
    !localBook.value.releaseDate
  ) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Please fill in all required fields.";
    return;
  }
  emit("submit", { ...localBook.value });
  localBook.value = {
    bookName: "",
    bookDescription: "",
    bookCoverImage: "",
    onlineBuyingLink: "",
    onlinePDFLink: "",
    authorId: "",
    releaseDate: "",
    genreId: "",
  };
  isBookNameExists.value = false;
  closeDialog();
}
function closeSnackBar() {
  snackbar.value.value = false;
}

async function checkBookNameExists() {
  isBookNameExists.value = false;
  if (!localBook.value.bookName) return;
  try {
    const exists = await BookServices.checkBookNameExists(
      localBook.value.bookName
    );
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
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="600"
  >
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
        <v-menu
  v-model="releaseDateMenu"
  :close-on-content-click="false"
  transition="scale-transition"
  offset-y
  min-width="auto"
>
  <template #activator="{ props }">
    <v-text-field
      :model-value="localBook.releaseDate"
      label="Release Date"
      readonly
      v-bind="props"
      outlined
      required
      @click="releaseDateMenu = true"
    />
  </template>
  <v-date-picker
    v-model="releaseDateObj"
    @update:model-value="releaseDateMenu = false"
  />
</v-menu>
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
  <v-snackbar v-model="snackbar.value" rounded="pill">
    {{ snackbar.text }}
    <template v-slot:actions>
      <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
