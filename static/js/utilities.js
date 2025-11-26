/**
 * Realiza una solicitud fetch y devuelve los datos como JSON.
 * @param {string} url La URL del endpoint.
 * @param {object} options Opciones para la solicitud fetch (method, body, headers, etc.).
 * @returns {Promise<any>} Los datos JSON de la respuesta, o undefined si no hay cuerpo.
 */
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error ${response.status}: ${errorData || response.statusText}`);
        }
        // Si la respuesta no tiene contenido (ej. 204 No Content), no intentes parsear JSON.
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        }
        return; // Devuelve undefined para respuestas no-JSON
    } catch (error) {
        console.error("Error en fetchData:", error);
        throw error;
    }
}

/**
 * Obtiene un ID de la ruta de la URL en una posición específica.
 * @param {number} [index=-1] El índice desde el final de la ruta (por ejemplo, -1 para el último segmento, -2 para el penúltimo).
 * @returns {string | null} El ID encontrado o null si no es válido.
 */
function getIdFromUrl(index = -1) {
    const pathParts = window.location.pathname.split('/');
    const id = pathParts.at(index);
    return id && !isNaN(parseInt(id)) ? id : null;
}

/**
 * Maneja el envío de un formulario usando Fetch API con el método PUT.
 * @param {Event} event El evento del formulario.
 * @param {string} entityId El ID de la entidad a actualizar.
 * @param {string} endpointUrl La URL base del endpoint (ej. '/playlists').
 * @param {string} successMessage El mensaje a mostrar en caso de éxito.
 * @param {string} redirectUrl La URL a la que redirigir tras el éxito.
 */
async function handleFormSubmit(event, entityId, endpointUrl, successMessage, redirectUrl) {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        const response = await fetch(`${endpointUrl}/${entityId}`, {
            method: 'PUT',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || successMessage);
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        } else {
            throw new Error(result.message || 'Ocurrió un error al actualizar.');
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert(error.message);
    }
}

/**

 * Formatea una duración en segundos al formato mm:ss.
 * @param {number} seconds La duración en segundos.
 * @returns {string} La duración formateada.
 */

function formatDuration(seconds) {
    const totalSeconds = Math.round(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const paddedSeconds = secs < 10 ? `0${secs}` : secs;
    return `${minutes}:${paddedSeconds}`;
}



/**
 * Carga datos de un endpoint y los renderiza en una vista de rejilla.
 * @param {string} endpoint La URL del endpoint para obtener los datos.
 * @param {string} containerId El ID del elemento contenedor.
 * @param {function(object): string} templateFunction La función que genera el HTML para un item.
 * @param {string} [errorMessage='Error al cargar los datos.'] El mensaje de error a mostrar.
 */

async function loadAndRenderGrid(endpoint, containerId, templateFunction, errorMessage = 'Error al cargar los datos.') {
    const container = document.getElementById(containerId);
    if (!container) return [];

    try {
        const data = await fetchData(endpoint);
        if (data && data.length > 0) {
            container.innerHTML = data.map(templateFunction).join('');
        } else {
            container.innerHTML = '<p>No hay elementos para mostrar.</p>';
        }
        return data || [];
    } catch (error) {
        container.innerHTML = `<p>${errorMessage}</p>`;
        console.error(error);
        return [];
    }
}
/**
 * Carga una barra de navegación para un artista con enlaces a sus canciones, álbumes y redes sociales.
 * @param {string|number} artistId El ID del artista.
 * @param {string} containerId El ID del elemento HTML contenedor donde se insertará la barra.
 */
function loadArtistBar(artistId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Error: Contenedor con ID '${containerId}' no encontrado.`);
        return;
    }

    const artistBarHTML = `
        <nav class="artist-nav">
            <a href="/artists/${artistId}/songs">Canciones</a>
            <a href="/artists/${artistId}/albums">Álbumes</a>
            <a href="/artists/${artistId}/social-networks">Redes Sociales</a>
        </nav>
    `;

    container.innerHTML = artistBarHTML;
}

/**
 * Configura una barra de búsqueda para filtrar y mostrar resultados en una rejilla.
 * @param {string} searchInputId ID del campo de entrada de búsqueda.
 * @param {string} searchButtonId ID del botón de búsqueda.
 * @param {string} resultsContainerId ID del contenedor para los resultados.
 * @param {string} searchEndpoint Endpoint base para la búsqueda (ej. '/get/songs/search').
 * @param {string} initialEndpoint Endpoint para cargar los resultados iniciales cuando la búsqueda está vacía.
 * @param {function(object): string} templateFunction Función para generar el HTML de un item.
 * @param {string} [errorMessage='Error al cargar los datos.'] Mensaje de error.
 */
function setupSearch(searchInputId, searchButtonId, resultsContainerId, searchEndpoint, initialEndpoint, templateFunction, errorMessage = 'Error al cargar los datos.', onDataLoaded) {
    const searchInput = document.getElementById(searchInputId);
    const searchButton = document.getElementById(searchButtonId);

    if (!searchInput || !searchButton) {
        console.error('No se encontraron los elementos de búsqueda (input o botón).');
        return;
    }

    const performSearch = async () => {
        const searchTerm = searchInput.value.trim();
        let endpoint;
        if (searchTerm) {
            endpoint = `${searchEndpoint}?q=${encodeURIComponent(searchTerm)}`;
        } else {
            endpoint = initialEndpoint;
        }
        const data = await loadAndRenderGrid(endpoint, resultsContainerId, templateFunction, errorMessage);
        if (onDataLoaded) {
            onDataLoaded(data);
        }
    };

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
}

/**
 * Manages music playback for a list of songs.
 */
class MusicPlayer {
    constructor(options) {
        this.songs = options.songs || [];
        this.playerElement = document.getElementById(options.playerElementId);
        this.audioElement = document.getElementById(options.audioElementId);
        this.titleElement = document.getElementById(options.titleElementId);
        this.prevButton = document.getElementById(options.prevButtonId);
        this.nextButton = document.getElementById(options.nextButtonId);
        this.playAllButton = document.getElementById(options.playAllButtonId);

        this.currentSongIndex = 0;

        if (!this.playerElement || !this.audioElement || !this.titleElement || !this.prevButton || !this.nextButton || !this.playAllButton) {
            console.error("MusicPlayer: One or more required DOM elements are missing.");
            return;
        }

        this.initEventListeners();
    }

    initEventListeners() {
        this.playAllButton.addEventListener('click', () => this.startPlayback());
        this.audioElement.addEventListener('ended', () => this.playNext());
        this.nextButton.addEventListener('click', () => this.playNext());
        this.prevButton.addEventListener('click', () => this.playPrev());
    }

    updateSongs(newSongs) {
        this.songs = newSongs;
        if (this.songs && this.songs.length > 0) {
            this.playAllButton.style.display = 'inline-block';
        } else {
            this.playAllButton.style.display = 'none';
            this.playerElement.style.display = 'none';
        }
    }
    
    removeSong(songId) {
        this.songs = this.songs.filter(song => song.id_song !== songId);
        this.updateSongs(this.songs);
    }

    startPlayback() {
        if (this.songs.length > 0) {
            this.playerElement.style.display = 'block';
            this.playSong(0);
        } else {
            alert('No hay canciones para reproducir.');
        }
    }

    playSong(index) {
        if (index >= 0 && index < this.songs.length) {
            const song = this.songs[index];
            this.titleElement.textContent = song.title;

            if (song.song_path) {
                this.audioElement.src = song.song_path;
                this.audioElement.play().catch(e => console.error("Error trying to play audio:", e));
            } else {
                console.error("Error: song.song_path is missing for song:", song);
            }
            this.currentSongIndex = index;
        }
    }

    playNext() {
        if (this.songs.length === 0) return;
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.playSong(this.currentSongIndex);
    }

    playPrev() {
        if (this.songs.length === 0) return;
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.playSong(this.currentSongIndex);
    }
}