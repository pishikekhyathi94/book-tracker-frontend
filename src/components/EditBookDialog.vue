<script setup>
import { ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: Boolean,
  book: Object,
  authors: { type: Array, default: () => [] },
  genres: { type: Array, default: () => [] } 
});

const emit = defineEmits(["update:modelValue", "save"]);

const localBook = ref({});

watch(
  () => props.book,
  (newBook) => {
    localBook.value = { ...newBook };
  },
  { immediate: true }
);

function closeDialog() {
  emit("update:modelValue", false);
}

function saveBookDetails() {
  emit("save", localBook.value);
  closeDialog();
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="600px"
  >
    <v-card>
      <v-card-title>Edit Book Details</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="localBook.bookName"
          label="Book Name"
          outlined
        ></v-text-field>
        <v-textarea
          v-model="localBook.bookCoverImage"
          label="Book Cover Image URL"
          outlined
        ></v-textarea>
        <v-textarea
          v-model="localBook.bookDescription"
          label="Description"
          outlined
        ></v-textarea>
        <v-select
          v-model="localBook.bookAuthorId"
          :items="authors"
          item-title="authorName"
          item-value="id"
          label="Author"
          outlined
          required
        />
        <v-select
          v-model="localBook.bookGenreId"
          :items="genres"
          item-title="bookGenre"
          item-value="id"
          label="Genre"
          outlined
          required
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="flat"
          color="primary header-btn"
          @click="saveBookDetails"
          >Save</v-btn
        >
        <v-btn
          variant="outlined"
          color="secondary header-btn"
          @click="closeDialog"
          >Cancel</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
