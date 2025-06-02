<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import GenreServices from "../services/GenreServices.js";
import AddGenreDialog from './AddGenreDialog.vue';
import DeleteConfirmationDialog from './DeleteConfirmationDialog.vue';

const router = useRouter();
const showDetails = ref(false);
const user = ref(null);
const genres = ref([]);
const showGenreDialog = ref(false);
const selectedGenre = ref(null);
const isDeleteDialogOpen = ref(false);

const props = defineProps({
  tab: {
    required: true,
  },
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  console.log(user.value, "24::");
  await getGenres();
});

async function getGenres() {
  await GenreServices.getGenres(user.value.id)
    .then((response) => {
      genres.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function openEditGenre(genre) {
  selectedGenre.value = {
    bookGenre: genre.bookGenre,
    description: genre.description,
    genreId: genre.id
  };
  showGenreDialog.value = true;
}

async function updateGenre(values) {
  const genreId = values.genreId;
  await GenreServices.updateGenre(genreId, values)
    .then((response) => {
      if (response?.status === 200) {
         getGenres();
        showGenreDialog.value = false;
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = `${values?.bookGenre} updated successfully!`;
      }
    })
    .catch((error) => {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error?.response?.data?.message;
    });
}

async function confirmDelete() {
  await GenreServices.deleteGenre(selectedGenre.value.id)
    .then((response) => {
      if (response?.status === 200) {
        getGenres();
        isDeleteDialogOpen.value = false;
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = `Genre deleted successfully!`;
      }
    })
    .catch((error) => {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error?.response?.data?.message;
    });
}

defineExpose({ getGenres });
</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-5 mx-6"
    @click="showDetails = !showDetails"
    v-for="genre in genres"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          <span class="font-weight-black">{{ genre?.bookGenre }}</span>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-pencil"
            @click.stop="openEditGenre(genre)"
            class="mr-4"
          ></v-icon>
          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-delete"
            @click.stop="isDeleteDialogOpen = true; selectedGenre = genre;"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-expand-transition>
      <v-card-text class="body-1" v-show="showDetails">
        {{ genre?.description }}
      </v-card-text>
    </v-expand-transition>
  </v-card>
  <AddGenreDialog
    v-model="showGenreDialog"
    :genre="selectedGenre"
    @submit="updateGenre"
  />
  <DeleteConfirmationDialog
    v-model="isDeleteDialogOpen"
    message="Are you sure you want to delete this genre?"
    @confirm="confirmDelete"
  />
</template>

