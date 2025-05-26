<script setup>
import { ref, watch, onMounted } from "vue";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog.vue";
import AuthorCard from "../components/AuthorCard.vue";
import AddAuthorDialog from "../components/AddAuthorDialog.vue";
import AuthorServices from "../services/AuthorServices.js";

const tab = ref(null);
const loading = ref(false);
const search = ref("");
const user = ref(null);
const showAuthorDialog = ref(false);
const authorCardRef = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});

watch(tab, () => {
  search.value = "";
});

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
      snackbar.value.text = error?.response?.data?.message;
    });
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<style>
.header-btn .v-btn__content {
  font-weight: 600;
}
</style>

<template>
  <v-card class="w-100">
    <v-row>
      <v-col cols="10">
        <v-tabs v-model="tab" align-tabs="left" color="secondary" class="mb-4 px-6">
          <v-tab :value="1">Books List</v-tab>
          <v-tab :value="2">Recommendations</v-tab>
          <v-tab :value="3">Whislist</v-tab>
          <v-tab :value="4">Authors</v-tab>
          <v-tab :value="5">Genres</v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="2">
        <v-btn variant="outlined" @click="showAuthorDialog = true" v-if="tab === 4" class="my-2 header-btn"
          color="secondary">
          Add Author
        </v-btn>
      </v-col>
    </v-row>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item v-for="n in 3" :key="n" :value="n">
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
          single-line class="mb-4 px-6"></v-text-field>
        <v-container fluid>
          <v-row>
              <span>Content Coming Soon</span>
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
    </v-tabs-window>
    <AddAuthorDialog v-model="showAuthorDialog" @submit="createAuthor" />
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
