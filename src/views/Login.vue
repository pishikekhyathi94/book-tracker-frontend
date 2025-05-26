<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import booksBg from "../assets/images/booksbg.jpg";

const router = useRouter();
const isCreateAccount = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

onMounted(async () => {
  localStorage.removeItem("user");
});

async function createAccount() {
  await UserServices.addUser(user.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Account created successfully!";
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function openCreateAccount() {
  isCreateAccount.value = true;
}

function closeCreateAccount() {
  isCreateAccount.value = false;
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
  <v-container
    :style="{
      backgroundImage: `url(${booksBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      margin: '0',
      display: 'flex',
      padding: '2rem 3rem',
      height: '100%',
    }"
  >
    <v-row align="center">
      <v-col cols="4"></v-col>
      <v-col cols="8">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Login </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="user.email"
              label="Email"
              required
            ></v-text-field>

            <v-text-field
              v-model="user.password"
              label="Password"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="flat" color="secondary header-btn" @click="openCreateAccount()"
              >Create Account</v-btn
            >
            <v-spacer></v-spacer>

            <v-btn variant="flat" color="primary header-btn">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog persistent v-model="isCreateAccount" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Create Account </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="user.firstName"
            label="First Name"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.lastName"
            label="Last Name"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.email"
            label="Email"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.password"
            label="Password"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="secondary" @click="closeCreateAccount()"
            >Close</v-btn
          >
          <v-btn variant="flat" color="primary" @click="createAccount()"
            >Create Account</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
