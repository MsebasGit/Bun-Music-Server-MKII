import { writable } from "svelte/store";

// Helper para leer de localStorage de forma segura
const getStoredAuth = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("isLoggedIn") === "true";
    }
    return false;
};

function createAuthStore() {
    const { subscribe, set } = writable(getStoredAuth());

    return {
        subscribe,
        login: () => {
            localStorage.setItem("isLoggedIn", "true");
            set(true);
        },
        logout: () => {
            localStorage.removeItem("isLoggedIn");
            set(false);
        }
    };
}

export const auth = createAuthStore();