<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  modelValue: Boolean,
  book: Object,
});

const emit = defineEmits(["update:modelValue"]);

function closeDialog() {
  emit("update:modelValue", false);
}
</script>
<style>
.book-cover-image .v-img__img {
  object-fit: fill !important;
}
</style>
<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="800px"
  >
    <v-card>
      <v-card-title class="headline">Book Details</v-card-title>
      <v-card-text>
        <v-img
          :src="book?.bookCoverImage"
          alt="Book Cover"
          max-height="300"
          cover
          class="mb-4 book-cover-image"
        ></v-img>
        <v-divider class="my-3"></v-divider>

        <v-row>
          {{ console.log(book, "26::") }}
          <v-col cols="12" md="4">
            <strong>Title:</strong> {{ book?.bookName }}
          </v-col>
          <v-col cols="12" md="4">
            <strong>Author:</strong> {{ book?.bookAuthor?.authorName }}
          </v-col>
          <v-col cols="12" md="4">
            <strong>Genre:</strong> {{ book?.bookGenre?.bookGenre }}
          </v-col>
          <v-col cols="12" md="12">
            <strong>Description:</strong>
            <p>{{ book?.bookDescription }}</p>
          </v-col>
          <v-col cols="12" md="12">
            <v-btn color="primary" variant="flat" class="me-4">Start Reading</v-btn>
            <v-btn color="secondary" variant="flat" >Buy Online</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
