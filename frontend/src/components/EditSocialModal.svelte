<script>
    // Props
    export let show = false;
    export let social = {
        id: "",
        platform: "",
        url: ""
    };

    // Cerrar modal
    const close = () => {
        show = false;
    };

    // Guardar cambios
    const saveChanges = async () => {
        console.log("Saving social:", social);

        /*
        try {
            const res = await fetch(`/artist/socials/${social.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(social)
            });

            if (!res.ok) throw new Error("Error en el servidor");

            alert("¡Red social actualizada!");
        } catch (error) {
            alert("Error: " + error.message);
        }
        */

        show = false;
    };
</script>

{#if show}
<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">

        <h2 class="text-xl font-semibold mb-4">Editar red social</h2>

        <!-- Plataforma -->
        <div class="mb-4">
            <label class="block mb-2 text-sm font-medium">Plataforma</label>

            <select
                bind:value={social.platform}
                class="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
            >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="x">X / Twitter</option>
                <option value="spotify">Spotify</option>
                <option value="soundcloud">SoundCloud</option>
                <option value="otra">Otra</option>
            </select>
        </div>

        <!-- URL -->
        <div class="mb-4">
            <label class="block mb-2 text-sm font-medium">URL</label>

            <input
                type="url"
                bind:value={social.url}
                class="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
            />
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3">
            <button
                on:click={close}
                class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
                Cancelar
            </button>

            <button
                on:click={saveChanges}
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Guardar cambios
            </button>
        </div>

    </div>
</div>
{/if}
