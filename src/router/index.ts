import App from "@/App.vue";
import { createRouter, createWebHistory } from "vue-router";
import Chefgeir from "@/views/Chefgeir.vue";
import Home from "@/views/Home.vue";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Home },
        { path: "/chefgeir", component: Chefgeir },
    ],
});

export default router;