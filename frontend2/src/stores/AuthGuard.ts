import { writable } from "svelte/store";

function createAuthStore() {
    // Leemos el estado inicial del navegador
    // Nota: Es buena práctica verificar si window existe para evitar errores en SSR (si usaras SvelteKit)
    const storedValue = typeof window !== "undefined" ? localStorage.getItem("isLoggedIn") : "false";
    const initialValue = storedValue === "true";

    const { subscribe, set } = writable(initialValue);

    return {
        subscribe,
        login: () => {
            if (typeof window !== "undefined") localStorage.setItem("isLoggedIn", "true");
            set(true);
        },
        logout: () => {
            if (typeof window !== "undefined") localStorage.removeItem("isLoggedIn");
            set(false);
        },
    };
}

export const auth = createAuthStore();