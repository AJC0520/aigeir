import App from "@/App.vue";
import { createRouter, createWebHistory } from "vue-router";
import Cookgeir from "@/views/Cookgeir.vue";
import Home from "@/views/Home.vue";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Home },
        { path: "/cookgeir", component: Cookgeir },
    ],
});

export default router;