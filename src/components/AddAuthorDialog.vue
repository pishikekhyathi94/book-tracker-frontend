<script setup>
import { ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: Boolean,
  author: Object
});

const emit = defineEmits(["update:modelValue", "submit"]);

const localAuthor = ref({
  authorName: "",
  booksPublished: "",
  description: ""
});

function closeDialog() {
  emit("update:modelValue", false);
}

function submitAuthor() {
  if (!localAuthor.value.authorName || !localAuthor.value.booksPublished || !localAuthor.value.description) return;
  emit("submit", { ...localAuthor.value });
  localAuthor.value = { authorName: "", booksPublished: "", description: "" };
  closeDialog();
}

watch(
  () => props.author,
  (newAuthor) => {
    if (newAuthor) {
      localAuthor.value = { ...newAuthor };
    } else {
      localAuthor.value = { authorName: "", booksPublished: "", description: "" };
    }
  },
  { immediate: true }
);

</script>

<template>
  <v-dialog :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)" max-width="500">
    <v-card>
      <v-card-title>Add Author</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="localAuthor.authorName"
          label="Author Name"
          outlined
          required
        ></v-text-field>
        <v-text-field
          v-model.number="localAuthor.booksPublished"
          label="Number of Books Published"
          type="number"
          outlined
          required
        ></v-text-field>
        <v-textarea
          v-model="localAuthor.description"
          label="Description"
          outlined
          required
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="flat"
          color="primary header-btn"
          @click="submitAuthor"
        >Submit</v-btn>
        <v-btn
          variant="outlined"
          color="secondary header-btn"
          @click="closeDialog"
        >Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>