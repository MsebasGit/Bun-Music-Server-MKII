<script>
    let platform = "";
    let url = "";

    const submitForm = async () => {
        const data = { platform, url };

        console.log("Enviando:", data);

        try {
            const res = await fetch("/artist/socials/new", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error("Error en el servidor.");

            alert("¡Red social añadida con éxito!");
            window.location.href = "/me";

        } catch (error) {
            alert("Error: " + error.message);
        }
    };
</script>

<h1 class="text-center text-3xl font-semibold mb-6">Añadir red social</h1>

<form
    on:submit|preventDefault={submitForm}
    class="grid gap-6 max-w-xl mx-auto bg-white p-6 rounded-lg shadow"
>

    <div>
        <label class="block mb-2 text-sm font-medium">Plataforma</label>

        <select
            bind:value={platform}
            required
            class="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
        >
            <option value="">Selecciona una plataforma...</option>
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

    <hr />

    <div>
        <label class="block mb-2 text-sm font-medium">URL del perfil</label>

        <input
            type="url"
            bind:value={url}
            required
            placeholder="https://..."
            class="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
        />
    </div>

    <hr />

    <button
        type="submit"
        class="text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg"
    >
        Guardar
    </button>
</form>

<div class="flex justify-center mt-6">
    <button
        on:click={() => (window.location.href = "/me")}
        class="bg-gray-200 hover:bg-gray-300 px-5 py-2.5 rounded-lg"
    >
        Volver al studio...
    </button>
</div>
