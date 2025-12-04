<script lang="ts">
  import { Route } from "tinro";

  // Components
  import Sidebar from '../components/Sidebar.svelte';
  import GlobalPlayer from '../components/GlobalPlayer.svelte';

  // Page Views
  import Home from '../pages/Home.svelte';
  import SongView from '../pages/songs/SongView.svelte';
  import AllAlbums from '../pages/albums/AllAlbums.svelte';
  import AllArtists from '../pages/artists/AllArtists.svelte';
  import AllFavorites from '../pages/userSongRatings/AllFavorites.svelte';
  import AllPlaylists from '../pages/playlists/AllPlaylists.svelte';
    import SongsInPlaylist from "../pages/playlists/SongsInPlaylist.svelte";
    import SongsInAlbum from "../pages/albums/SongsInAlbum.svelte";

</script>

<div class="flex h-screen bg-gray-50">
  <Sidebar />

  <main class="flex-1 ml-48 overflow-y-auto h-full mb-24">
    <Route path="/">
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Panel Principal</h1>
        <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <Home />
        </div>
      </div>
    </Route>

    <Route path="/songs/:id" let:params><SongView id={params.id} /></Route>

    <Route path="/albums">
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Todos los Álbumes</h1>
        <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <AllAlbums />
        </div>
      </div>
    </Route>

    <Route path="/albums/:id" let:params><SongsInAlbum id={params.id} /></Route>

    <Route path="/artists">
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Todos los Artistas</h1>
        <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <AllArtists />
        </div>
      </div>
    </Route>
    
    <Route path="/artist/:id" let:params><SongsInArtist id={params.id} /></Route>

    <Route path="/favorites">
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Canciones Favoritas</h1>
        <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <AllFavorites />
        </div>
      </div>
    </Route>

    <Route path="/playlists">
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Todas las Listas de Reproducción</h1>
        <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <AllPlaylists />
        </div>
      </div>
    </Route>

    <Route path="/playlists/:id" let:params><SongsInPlaylist id={params.id} /></Route>
    
    <Route fallback>
      <div class="text-center mt-10 p-6">
        <h2 class="text-xl font-bold text-gray-700">Página no encontrada</h2>
        <a href="/" class="text-blue-600 hover:underline">Volver al inicio</a>
      </div>
    </Route>

  </main>

  <GlobalPlayer />
</div>