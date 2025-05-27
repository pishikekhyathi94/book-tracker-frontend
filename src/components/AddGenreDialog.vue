<script setup>
import { ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: Boolean,
  genre: Object
});

const emit = defineEmits(["update:modelValue", "submit"]);

const localGenre = ref({
  bookGenre: "",
  description: ""
});

function closeDialog() {
  emit("update:modelValue", false);
}

function submitGenre() {
  if (!localGenre.value.bookGenre || !localGenre.value.description) return;
  emit("submit", { ...localGenre.value });
  localGenre.value = { bookGenre: "", description: "" };
  closeDialog();
}

watch(
  () => props.genre,
  (newGenre) => {
    if (newGenre) {
      localGenre.value = { ...newGenre };
    } else {
      localGenre.value = { bookGenre: "", description: "" };
    }
  },
  { immediate: true }
);

</script>

<template>
  <v-dialog :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)" max-width="500">
    <v-card>
      <v-card-title>Genre</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="localGenre.bookGenre"
          label="Genre Name"
          outlined
          required
        ></v-text-field>
        <v-textarea
          v-model="localGenre.description"
          label="Description"
          outlined
          required
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="flat"
          color="primary header-btn"
          @click="submitGenre"
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