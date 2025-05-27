<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  book: { type: Object, required: true },
  tab: { type: [Number, String], default: 1 },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['edit', 'delete', 'viewDetails']);

function openEdit() {
  emit('edit', props.book);
}
function openDelete() {
  emit('delete', props.book);
}
function viewDetails() {
  emit('viewDetails', props.book);
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

    <v-img height="200" :src="book.bookCoverImage" class="book-cover-image"></v-img>

    <v-card-item>
      <v-card-title class="text-h5 font-weight-bold">{{ book?.bookName }}</v-card-title>
      <v-card-subtitle>
        <span class="me-1 font-weight-medium">{{ book?.bookGenre?.bookGenre }}</span>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-row align="center" class="mx-0 mb-2 justify-space-between">
        <!-- <v-rating :model-value="book?.rating" color="amber" density="compact" size="small" half-increments readonly></v-rating> -->
        <div class="text-subtitle-1">
          <v-icon color="error" size="small">mdi-book-account-outline</v-icon>
          <span class="ms-1">{{ book?.bookAuthor?.authorName }}</span>
        </div>
      </v-row>
      <p class="text-justify overflow-y-auto" style="height: 100px">
        {{ book?.bookDescription || 'No description available.' }}
      </p>
    </v-card-text>
    <v-card-actions>
      <v-col cols="6" class="pa-0">
        <v-btn color="primary" text="View Details" border @click="viewDetails" class="header-btn"></v-btn>
      </v-col>
      <v-col cols="6" class="d-flex pa-0 justify-end">
        <v-btn color="red" v-if="tab !== 2" icon="mdi-pencil-box-outline" size="large" @click="openEdit"></v-btn>
        <v-btn v-if="book?.wishlist" color="red" icon="mdi-heart" size="large"></v-btn>
        <v-btn v-if="!book?.wishlist" color="red" icon="mdi-heart-outline" size="large"></v-btn>
        <v-btn v-if="tab !== 2" color="red" icon="mdi-delete" @click="openDelete" size="large"></v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
  </v-col>
</template>