<script lang="ts">
    import { Search } from "flowbite-svelte";

    // DEBE tener 'export' para ser una prop
    export let onSearch: (text: string) => void = () => {}; 
    
    let query = "";
    let timer: any;

    $: {
        clearTimeout(timer);
        timer = setTimeout(() => {
            // Verificación de seguridad
            if (typeof onSearch === 'function') {
                onSearch(query);
            }
        }, 300);
    }
</script>

<Search bind:value={query} />