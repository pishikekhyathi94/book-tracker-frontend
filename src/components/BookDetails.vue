<script setup>
import BookServices from "../services/BookServices.js";
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps({
  modelValue: Boolean,
  book: Object,
  wishlistUpdated: Function,
  user: { type: Object, required: true },
});

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const finishReading = ref(false);
const showRateBook = ref(false);
const rating = ref(0);
const comment = ref("");
const startPageNumber = ref("");
const editRating = ref(null);
const emit = defineEmits(["update:modelValue"]);

function closeDialog() {
  emit("update:modelValue", false);
}

function handleStartReading() {
  startedReading(startPageNumber.value || 1);
  startPageNumber.value = "";
  handleStartContinueReading();
}

async function updatePageNumber() {
  if (!startPageNumber.value) return;
  startedReading(startPageNumber.value);
  startPageNumber.value = "";
}

async function startedReading(pageNumber) {
  const book = props.book;
  try {
    const payload = {
      bookId: book.id,
      userId: props.user.id,
      currentPageNumber: pageNumber,
      isStartedReading: true,
      isReadingFinished: false,
    };
    await BookServices.startedReading(payload).then((response) => {
      if (response?.status === 200) {
        book.startedReading = true;
      }
    });
    if (props.wishlistUpdated) {
      props.wishlistUpdated();
    }
    emit("update:modelValue", false);
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text =
      error?.response?.data?.message || "Error starting reading book.";
  }
}

async function finishReadingBook() {
  const book = props.book;
  try {
    const payload = {
      bookId: book.id,
      userId: props.user.id,
      isStartedReading: true,
      isReadingFinished: true,
    };
    await BookServices.finishedReading(payload).then((response) => {
      if (response?.status === 200) {
        finishReading.value = true;
      }
    });
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text =
      error?.response?.data?.message || "Error finishing reading book.";
  }
}

async function submitRating(isUpdate = false) {
  if (!rating.value || !comment.value) return;
  const book = props.book;

  if (isUpdate === true && editRating.value) {
    try {
      const payload = {
        bookId: book.id,
        userId: props.user.id,
        rating: rating.value,
        review: comment.value,
      };
      await BookServices.rateUpdateBook(payload, editRating.value.id).then(
        (response) => {
          if (response?.status === 200) {
            showRateBook.value = false;
            rating.value = 0;
            comment.value = "";
            emit("update:modelValue", false);
            editRating.value = null;
            if (props.wishlistUpdated) {
              props.wishlistUpdated();
            }
          }
        }
      );
    } catch (error) {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text =
        error?.response?.data?.message || "Error rating book.";
    }
  } else {
    try {
      const payload = {
        bookId: book.id,
        userId: props.user.id,
        rating: rating.value,
        review: comment.value,
      };
      await BookServices.rateBook(payload).then((response) => {
        if (response?.status === 200) {
          showRateBook.value = false;
          rating.value = 0;
          comment.value = "";
          emit("update:modelValue", false);
          if (props.wishlistUpdated) {
            props.wishlistUpdated();
          }
        }
      });
    } catch (error) {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text =
        error?.response?.data?.message || "Error rating book.";
    }
  }
}

async function handleStartContinueReading() {
  let url = props.book.onlinePDFLink;
  if (url && !/^https?:\/\//i.test(url)) {
    url = `http://${props.book.onlinePDFLink}`;
  }
  if (url) {
    window.open(url, "_blank");
  }
}

function openEditRating(r) {
  showRateBook.value = true;
  editRating.value = r;
  rating.value = r.rating;
  comment.value = r.review;
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
          <v-col cols="12" md="4">
            <strong>Title:</strong> {{ book?.bookName }}
          </v-col>
          <v-col cols="12" md="4">
            <strong>Author:</strong> {{ book?.bookAuthor?.authorName }}
          </v-col>
          <v-col cols="12" md="4">
            <strong>Genre:</strong> {{ book?.bookGenre?.bookGenre }}
          </v-col>
          <v-col cols="12" md="4">
            <strong>Release Date:</strong>
            {{ new Date(book?.releaseDate).toLocaleDateString() }}
          </v-col>
          <v-col cols="12" md="4">
            <strong>Buy Online:</strong>
            <a
              v-if="book?.onlineBuyingLink"
              :href="book.onlineBuyingLink"
              target="_blank"
              rel="noopener"
              style="color: #1976d2; text-decoration: underline"
            >
              {{ book.onlineBuyingLink }}
            </a>
          </v-col>
          <v-col cols="12" md="12">
            <strong>Description:</strong>
            <p>{{ book?.bookDescription }}</p>
          </v-col>
          <v-card
            class="rounded-lg elevation-5 mb-5 mx-6"
            v-for="rating in book?.bookRatings"
          >
            <v-card-title class="headline">
              <v-row align="center">
                <v-col cols="8" md="8">
                  <v-rating
                    v-model="rating.rating"
                    color="amber"
                    size="20"
                    readonly
                  ></v-rating>
                </v-col>
                <v-col cols="4" md="4" class="text-end">
                  <v-icon
                    size="small"
                    icon="mdi-pencil"
                    @click="openEditRating(rating)"
                    class="mr-4"
                  ></v-icon>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col cols="8" md="8">
                  <span class="ms-2">{{ rating.review }}</span>
                </v-col>
              </v-row>
            </v-card-title>
          </v-card>
          <div v-if="showRateBook" class="mb-4 w-100">
            <v-rating
              v-model="rating"
              color="amber"
              class="mb-2"
              :half-increments="true"
            ></v-rating>
            <v-text-field
              v-model="comment"
              label="Your comment"
              outlined
              rows="2"
              class="mb-2 w-100"
            ></v-text-field>
          </div>
          <div class="mt-2 w-100">
            <v-row>
              <v-col cols="10" md="10">
                <v-text-field
                  v-model="startPageNumber"
                  label="Enter page number"
                  :disabled="!book?.bookStatus?.isStartedReading"
                  type="number"
                  v-if="!book?.bookStatus?.isReadingFinished && !finishReading" 
                  outlined
                  dense
                  class="mb-2"
                ></v-text-field>
              </v-col>
              <v-col cols="2" md="2">
                <v-btn
                  color="success"
                  v-if="!book?.bookStatus?.isReadingFinished && !finishReading" 
                  :disabled="!book?.bookStatus?.isStartedReading"
                  @click="updatePageNumber"
                >
                  Submit
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <v-col cols="12" md="12">
            <v-btn
              color="primary"
              variant="flat"
              class="me-4"
              v-if="!book?.bookStatus?.isStartedReading"
              :disabled="book?.bookStatus?.isStartedReading"
              @click="handleStartReading"
              >Start Reading</v-btn
            >
            <v-btn
              color="primary"
              variant="flat"
              class="me-4"
              v-if="
                book?.bookStatus?.isStartedReading &&
                !finishReading &&
                !book?.bookStatus?.isReadingFinished
              "
              @click="handleStartContinueReading"
              >{{
                `Continue Reading from Page ${book?.bookStatus?.currentPageNumber}`
              }}</v-btn
            >
            <v-btn
              color="secondary"
              variant="flat"
              v-if="!finishReading && !book?.bookStatus?.isReadingFinished"
              :disabled="!book?.bookStatus?.isStartedReading"
              @click="finishReadingBook"
              >Finish Reading</v-btn
            >
            <v-icon
              v-if="book?.bookStatus?.isReadingFinished || finishReading"
              icon="mdi-check-circle-outline"
              color="green"
              size="38"
            >
            </v-icon>
            <span v-if="book?.bookStatus?.isReadingFinished || finishReading"
              >Finished Reading</span
            >
            <v-btn
              v-if="book?.bookStatus?.isReadingFinished || finishReading"
              color="primary"
              class="ms-4"
              @click="editRating ? submitRating(true) : (showRateBook = true)"
            >
              {{ editRating ? "Edit Rating" : "Rate Book" }}
            </v-btn>
            <v-btn
              v-if="
                !editRating &&
                showRateBook &&
                (book?.bookStatus?.isReadingFinished || finishReading)
              "
              color="success"
              class="ml-2"
              @click="submitRating"
            >
              Submit Rating
            </v-btn>
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
