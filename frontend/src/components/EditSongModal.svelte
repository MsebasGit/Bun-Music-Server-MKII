<script>
    // Props para controlar visibilidad y datos de la canción
    export let show = false;
    export let song = {
        id: "",
        title: "",
        duration: "",
        artist: "",
        audioFile: null
    };

    // Cerrar modal
    const close = () => {
        show = false;
    };

    // Guardar cambios
    const saveChanges = async () => {
        const formData = new FormData();
        formData.append("title", song.title);
        formData.append("duration", song.duration);
        formData.append("artist", song.artist);

        if (song.audioFile) {
            formData.append("audio_file", song.audioFile);
        }

        console.log("Saving song:", song);

        /*
        try {
            const res = await fetch(`/songs/${song.id}`, {
                method: "PUT",
                body: formData
            });

            if (!res.ok) throw new Error("Error al actualizar la canción");

            alert("¡Canción actualizada!");
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

        <h2 class="text-xl font-semibold mb-4">Editar canción</h2>

        <!-- Título -->
        <div class="mb-4">
            <label class="block text-sm mb-2 font-medium">Nombre</label>
            <input
                type="text"
                bind:value={song.title}
                class="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
            />
        </div>

        <!-- Duración -->
        <div class="mb-4">
            <label class="block text-sm mb-2 font-medium">Duración</label>
            <input
                type="text"
                bind:value={song.duration}
                placeholder="03:45"
                class="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
            />
        </div>

        <!-- Artista -->
        <div class="mb-4">
            <label class="block text-sm mb-2 font-medium">Artista</label>
            <input
                type="text"
                bind:value={song.artist}
                class="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
            />
        </div>

        <!-- Reemplazo de audio -->
        <div class="mb-4">
            <label class="block text-sm mb-2 font-medium">Reemplazar archivo de audio (opcional)</label>
            <input
                type="file"
                accept="audio/mp3, audio/wav, audio/flac"
                on:change={(e) => (song.audioFile = e.target.files[0])}
                class="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
            />
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3 mt-4">
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
