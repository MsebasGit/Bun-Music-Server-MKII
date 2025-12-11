<script>
    let title = "";
    let duration = "";
    let artist = "";
    let audioFile = null;

    const submitForm = async (e) => {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("duration", duration);
        formData.append("artist", artist);
        formData.append("audio_file", audioFile);

        console.log("Song data:", { title, duration, artist, audioFile });

        /*
        try {
            const res = await fetch("/songs/new", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Error al subir la canción");

            alert("¡Canción guardada con éxito!");
        } catch (error) {
            alert("Error: " + error.message);
        }
        */
    };
</script>

<h1 class="text-center text-3xl font-semibold mb-6">Añadir canción</h1>

<form
    on:submit|preventDefault={submitForm}
    class="grid gap-6 max-w-xl mx-auto bg-white p-6 rounded-lg shadow"
>

    <!-- Nombre -->
    <div>
        <label for="title" class="block mb-2 text-sm font-medium text-gray-900">
            Nombre de la canción
        </label>
        <input
            id="title"
            type="text"
            bind:value={title}
            required
            class="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
        />
    </div>

    <hr />

    <!-- Archivo -->
    <div>
        <label for="audio" class="block mb-2 text-sm font-medium text-gray-900">
            Archivo de audio
        </label>
        <input
            id="audio"
            type="file"
            accept="audio/mp3, audio/wav, audio/flac"
            required
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            on:change={(e) => (audioFile = e.target.files[0])}
        />
    </div>

    <hr />

    <!-- Duración -->
    <div>
        <label for="duration" class="block mb-2 text-sm font-medium text-gray-900">
            Duración (mm:ss)
        </label>
        <input
            id="duration"
            type="text"
            placeholder="03:45"
            bind:value={duration}
            required
            class="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
        />
    </div>

    <hr />

    <!-- Artista -->
    <div>
        <label for="artist" class="block mb-2 text-sm font-medium text-gray-900">
            Artista (opcional)
        </label>
        <input
            id="artist"
            type="text"
            bind:value={artist}
            placeholder="Nombre del artista"
            class="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
        />
    </div>

    <hr />

    <button
        type="submit"
        class="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
    >
        Guardar canción
    </button>

</form>

<div class="flex justify-center mt-6">
    <button
        on:click={() => (window.location.href = "/me")}
        class="text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
    >
        Volver al estudio...
    </button>
</div>
