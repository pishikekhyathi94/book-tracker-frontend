import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import BooksView from "./views/BooksView.vue";

const routes = [
    {
        path: "/",
        name: "login",
        component: Login,
      },
    {
        path: "/books",
        name: "books",
        component: BooksView,
    },
];

const router =  createRouter({
    history: createWebHistory(),
    routes,
});

export default router;