<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AuthorServices from "../services/AuthorServices.js";
import AddAuthorDialog from './AddAuthorDialog.vue';
import DeleteConfirmationDialog from './DeleteConfirmationDialog.vue';

const router = useRouter();
const showDetails = ref(false);
const user = ref(null);
const authors = ref([]);
const showAuthorDialog = ref(false);
const selectedAuthor = ref(null);
const isDeleteDialogOpen = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const props = defineProps({
    tab: {
        required: true,
    },
});

onMounted(async () => {
    user.value = JSON.parse(localStorage.getItem("user"));
    console.log(user.value, "24::");
    await getAuthors();
});

async function getAuthors() {
    await AuthorServices.getAuthors(user.value.id)
        .then((response) => {
            authors.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

function openEditAuthor(author) {
    selectedAuthor.value = {
        authorName: author.authorName,
        booksPublished: author.booksPublished,
        description: author.description,
        authorId: author.id
    };
    showAuthorDialog.value = true;
}

async function updateAuthor(values) {
    await AuthorServices.updateAuthor(values?.authorId, values)
        .then((response) => {
            console.log(response, "response::");
            if (response?.status === 200) {
                getAuthors();
                showAuthorDialog.value = false;
                snackbar.value.value = true;
                snackbar.value.color = "green";
                snackbar.value.text = `${values?.authorName} updated successfully!`;
            }
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error?.response?.data?.message;
        });
}

async function confirmDelete() {
    await AuthorServices.deleteAuthor(selectedAuthor.value.id)
        .then((response) => {
            if (response?.status === 200) {
                getAuthors();
                isDeleteDialogOpen.value = false;
                snackbar.value.value = true;
                snackbar.value.color = "green";
                snackbar.value.text = `Author deleted successfully!`;
            }
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error?.response?.data?.message;
        });
}

defineExpose({ getAuthors });
</script>

<template>
    <div v-if="authors.length > 0">
        <v-card class="rounded-lg elevation-5 mb-5 mx-6" @click="showDetails = !showDetails" v-for="author in authors">
            <v-card-title class="headline">
                <v-row align="center">
                    <v-col cols="10">
                        <!-- {{ author.name }} -->
                        <v-chip class="ma-2" color="primary" label>
                            <v-icon start icon="mdi-account-edit"></v-icon>
                            {{ author?.authorName }}
                        </v-chip>
                        <v-chip class="ma-2" color="accent" label>
                            <v-icon start icon="mdi-book-edit"></v-icon>
                            {{ author?.booksPublished }} Books Published
                        </v-chip>
                    </v-col>
                    <v-col class="d-flex justify-end">
                        <v-icon v-if="user !== null" size="small" icon="mdi-pencil" @click.stop="openEditAuthor(author)"
                            class="mr-4"></v-icon>
                        <v-icon v-if="user !== null" size="small" icon="mdi-delete"
                            @click.stop="isDeleteDialogOpen = true; selectedAuthor = author;"></v-icon>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-expand-transition>
                <v-card-text class="body-1" v-show="showDetails">
                    {{ author?.description }}
                </v-card-text>
            </v-expand-transition>
        </v-card>
        <AddAuthorDialog v-model="showAuthorDialog" :author="selectedAuthor" @submit="updateAuthor" />
        <DeleteConfirmationDialog v-model="isDeleteDialogOpen" message="Are you sure you want to delete this author?"
            @confirm="confirmDelete" />
    </div>
    <div v-else class="text-center my-5">
        <v-card-title class="headline text-center">
            No authors found
        </v-card-title>
        <p>Please add some authors to get started.</p>
    </div>
    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>
