<script setup>
import logo from "/logo.jpg";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";

const router = useRouter();

const user = ref(null);
const logoURL = ref("");
const messages = ref(null);

onMounted(() => {
  logoURL.value = logo;
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function logout() {
  await UserServices.logoutUser()
    .then((data) => {
      localStorage.removeItem("user");
      user.value = null;
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log(error);
    });
}

function gotoProfile() {
  router.push({ name: "profile" });
}
async function getNotifications() {
  await UserServices.getNotifications(user.value.id)
    .then((data) => {
      messages.value = data.data;
      user.value.notification_viewed = true;
    })
    .catch((error) => {
      console.log(error);
    });
}

</script>

<style>
.my-round-image img {
  border-radius: 8px;
}
.header-btn .v-btn__content {
  font-weight: 600;
}
</style>

<template>
  <div>
    <v-app-bar color="primary" app dark>
      <router-link :to="{ name: 'books' }">
        <v-img
          class="mx-2 my-round-image"
          :src="logoURL"
          height="50"
          width="150"
          contain
        ></v-img>
      </router-link>
      <v-spacer></v-spacer>
      <v-menu v-if="user !== null" class="me-2" min-width="200px"  rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="me-4" @click="getNotifications">
            <v-badge
              v-show="!user?.notification_viewed"
              :value="messages?.length"
              color="green"
              overlap
            >
              <v-icon color="secondary" size="large">mdi-bell</v-icon>
            </v-badge>
            <v-icon
              v-if="user?.notification_viewed"
              color="secondary"
              size="large"
              >mdi-bell</v-icon
            >
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-left">
              <p v-for="message in messages" class="text-caption mt-1">
                {{ message?.notification }}
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
      <v-menu v-if="user !== null" min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar class="mx-auto text-center" color="secondary" size="large">
              <span class="white--text font-weight-bold">{{
                `${user?.firstName.charAt(0)}${user?.lastName.charAt(0)}`
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="accent">
                <span class="white--text text-h5">{{
                  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                }}</span>
              </v-avatar>
              <h3>{{ `${user.firstName} ${user.lastName}` }}</h3>
              <p class="text-caption mt-1">
                {{ user?.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="gotoProfile()">Profile</v-btn>
              <v-btn rounded variant="text" @click="logout()"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>
