import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import BooksView from "./views/BooksView.vue";
import ProfileView from "./views/ProfileView.vue";

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
        meta: { requiresAuth: true },
    },
    {
        path: "/profile",
        name: "profile",
        component: ProfileView,
        meta: { requiresAuth: true },
    },
];

const router =  createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem("user"); 
  
    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: "login" });
    } else {
      next();
    }
  });

export default router;