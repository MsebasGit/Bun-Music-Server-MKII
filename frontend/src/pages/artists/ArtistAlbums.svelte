<script lang="ts">
    import { albumApi } from "../../services/apiClient";
    import type { Artist, Album } from "../../types/api";
    import { onMount } from "svelte";
    import ArtistMenu from "../../components/artist/ArtistMenu.svelte";
    import AlbumGrid from "../../components/album/AlbumGrid.svelte";

    export let artist: Artist;
    let albums: Album[] = [];
    let error: string | null = null;
    let loading: boolean = true;


    onMount(async () => {
        const result = await albumApi.getByArtistId(artist.id);
        if (result.success) {
            albums = result.data || [];
        } else {
            error = result.error || "Failed to fetch albums";
        }
        loading = false;
    });
</script>

<ArtistMenu {artist}>
</ArtistMenu>
<AlbumGrid {albums} />
