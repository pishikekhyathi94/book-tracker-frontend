<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  modelValue: Boolean,
  book: Object,
});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const showStartReadingInput = ref(false);
const startPageNumber = ref("");
const emit = defineEmits(["update:modelValue"]);

function closeDialog() {
  emit("update:modelValue", false);
}
function handleStartReading() {
  if (!startPageNumber.value) return;
  startedReading(startPageNumber.value);
  showStartReadingInput.value = false;
  startPageNumber.value = "";
}

async function startedReading(pageNumber) {
  if (book?.startedReading) {
    return;
  }
  try {
    const payload = {
      bookId: book.id,
      userId: book.userId,
      currentPageNumber: pageNumber,
      isStartedReading: true,
      isReadingFinished: false,
    };
    await BookServices.startedReading(payload).then((response) => {
      if (response?.status === 200) {
        book.startedReading = true;
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = `You have started reading the book successfully!`;
      }
    });
    emit("update:modelValue", false);
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text =
      error?.response?.data?.message || "Error starting reading book.";
  }
}
async function finishReadingBook() {
  if (!book?.startedReading) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "You haven't started reading this book yet!";
    return;
  }
  try {
    const payload = {
      bookId: book.id,
      userId: book.userId,
      isStartedReading: true,
      isReadingFinished: true,
    };
    await BookServices.startedReading(payload).then((response) => {
      if (response?.status === 200) {
        book.startedReading = false;
        book.finishedReading = true;
        finishReading.value = true;
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = `You have finished reading the book successfully!`;
      }
    });
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text =
      error?.response?.data?.message || "Error finishing reading book.";
  }
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
          <div v-if="showStartReadingInput" class="mt-2">
            <v-text-field
              v-model="startPageNumber"
              label="Enter page number"
              type="number"
              outlined
              dense
              class="mb-2"
            ></v-text-field>
            <v-btn color="success" @click="handleStartReading"> Submit </v-btn>
          </div>
          <v-col cols="12" md="12">
            <v-btn color="primary" variant="flat" @click="showStartReadingInput = true" class="me-4">Start Reading</v-btn>
            <v-btn color="secondary" variant="flat" @click="finishReadingBook" :disabled="!book?.startedReading">Finish Reading</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-dialog>
</template>
