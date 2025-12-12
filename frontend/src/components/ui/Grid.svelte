<script lang="ts">
    export let items: any[] = [];
</script>

<div class="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
    {#each items as item (item.id ?? item.id_song ?? item.id_album ?? item.id_artist ?? item.id_playlist)}
        <slot {item} />
    {/each}
</div>
