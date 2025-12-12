<script lang="ts">
  // @ts-nocheck
  import { Route } from "tinro";

  // Components
  import Sidebar from "../components/layout/Sidebar.svelte";
  import GlobalPlayer from "../components/player/GlobalPlayer.svelte";
  import { DarkMode } from "flowbite-svelte";

  // Page Views
  import Home from "../pages/Home.svelte";

  // General Pages
  import AllAlbums from "../pages/albums/AllAlbums.svelte";
  import AllArtists from "../pages/artists/AllArtists.svelte";
  import AllFavorites from "../pages/userSongRatings/AllFavorites.svelte";
  import AllPlaylists from "../pages/playlists/AllPlaylists.svelte";

  // Specific Pages
  import SongsInPlaylist from "../pages/playlists/SongsInPlaylist.svelte";
  import SongsInAlbum from "../pages/albums/SongsInAlbum.svelte";
  import Admin from "../pages/studio/Admin.svelte";
  import Login from "../pages/users/Login.svelte";

  import ArtistSongs from "../pages/artists/ArtistSongs.svelte";
  import ArtistAlbums from "../pages/artists/ArtistAlbums.svelte";
  import MySongs from "../pages/songs/MySongs.svelte";
  import MyAlbums from "../pages/albums/MyAlbums.svelte";
</script>

<div class="flex h-screen bg-gray-50 dark:bg-gray-800">
  <Sidebar />

  <main class="flex-1 overflow-auto h-full mb-24 px-4 md:ml-64">
    <Route path="/">
      <Home />
    </Route>

    <Route path="/albums">
      <AllAlbums />
    </Route>

    <Route path="/albums/:id" let:params><SongsInAlbum id={params.id} /></Route>

    <!-- Artists Routes -->
    <Route path="/artists">
      <AllArtists />
    </Route>

    <Route path="/artists/:id" let:params><ArtistSongs id={params.id} /></Route>
    <Route path="/artists/:id/songs" let:params><ArtistSongs id={params.id} /></Route>
    <Route path="/artists/:id/albums" let:params><ArtistAlbums id={params.id} /></Route>
    <!-- Removed commented-out ArtistDescription route as page file does not exist -->


    <!-- User Related Routes -->
    <Route path="/me/songs">
      <MySongs />
    </Route>
    <Route path="/me/albums">
      <MyAlbums />
    </Route>

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
