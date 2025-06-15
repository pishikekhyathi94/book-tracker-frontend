<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
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
const showPassword = ref(false);

onMounted(async () => {
  localStorage.removeItem("user");
  if (localStorage.getItem("user") !== null) {
    router.push({ name: "books" });
  }
});

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

function validatePassword() {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(user.value.password)) {
    snackbar.value = {
      value: true,
      color: "error",
      text: "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.",
    };
    return false;
  }
  return true;
}

async function createAccount() {
  if (validatePassword()) {
    await UserServices.addUser(user.value)
      .then(() => {
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = "Account created successfully!";
        closeCreateAccount();
        router.push({ name: "login" });
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  }
}

async function login() {
  await UserServices.loginUser(user)
    .then((data) => {
      window.localStorage.setItem("user", JSON.stringify(data.data));
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Login successful!";
      router.push({ name: "profile" });
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
  showPassword.value = false;
  user.value = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };
}

function closeCreateAccount() {
  isCreateAccount.value = false;
  showPassword.value = false;
  user.value = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };
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
              type="email"
              required
            ></v-text-field>

            <v-text-field
              v-model="user.password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="togglePasswordVisibility"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="flat" color="secondary header-btn" @click="openCreateAccount()"
              >Create Account</v-btn
            >
            <v-spacer></v-spacer>

            <v-btn variant="flat" color="primary header-btn" @click="login()">Login</v-btn>
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
            type="email"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="togglePasswordVisibility"
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
