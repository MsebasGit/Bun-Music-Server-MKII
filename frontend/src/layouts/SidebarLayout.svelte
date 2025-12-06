<script lang="ts">
  // @ts-nocheck
  import { Route } from "tinro";

  // Components
  import Sidebar from "../components/Sidebar.svelte";
  import GlobalPlayer from "../components/GlobalPlayer.svelte";
  import { DarkMode } from "flowbite-svelte";

  // Page Views
  import Home from "../pages/Home.svelte";
  import SongView from "../pages/songs/SongView.svelte";

  // General Pages
  import AllAlbums from "../pages/albums/AllAlbums.svelte";
  import AllArtists from "../pages/artists/AllArtists.svelte";
  import AllFavorites from "../pages/userSongRatings/AllFavorites.svelte";
  import AllPlaylists from "../pages/playlists/AllPlaylists.svelte";

  // Specific Pages
  import SongsInPlaylist from "../pages/playlists/SongsInPlaylist.svelte";
  import SongsInAlbum from "../pages/albums/SongsInAlbum.svelte";
  import SongsInArtist from "../pages/artists/SongsInArtist.svelte";
    import Admin from "../pages/studio/Admin.svelte";
    import Login from "../pages/users/Login.svelte";

</script>

<div class="flex h-screen bg-gray-50 dark:bg-gray-800">
  <Sidebar />

  <main class="flex-1 overflow-auto h-full mb-24 px-4 md:ml-64">
    <Route path="/">
      <Home />
    </Route>

    <Route path="/songs/:id" let:params><SongView id={params.id} /></Route>

    <Route path="/albums">
      <AllAlbums />
    </Route>

    <Route path="/albums/:id" let:params><SongsInAlbum id={params.id} /></Route>

    <Route path="/artists">
      <AllArtists />
    </Route>

    <Route path="/artists/:id" let:params><SongsInArtist id={params.id} /></Route
    >

    <Route path="/favorites">
      <AllFavorites />
    </Route>

    <Route path="/playlists">
      <AllPlaylists />
    </Route>

    <Route path="/playlists/:id" let:params
      ><SongsInPlaylist id={params.id} /></Route
    >

    <Route path="/studio">
      <Admin />
    </Route>

    <Route path="/login">
      <Login />
    </Route>

    <Route fallback>
      <div class="text-center mt-10 p-6">
        <h2 class="text-xl font-bold text-gray-700">Página no encontrada</h2>
        <a href="/" class="text-blue-600 hover:underline">Volver al inicio</a>
      </div>
    </Route>
  </main>

  <GlobalPlayer />
</div>

<div class="fixed bottom-4 right-4 z-50">
  <DarkMode />
</div>
