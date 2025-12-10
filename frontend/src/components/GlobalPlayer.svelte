<script lang="ts">
  import { playerStore } from "../stores/playerStore";
  import { Footer, Button, Range, Avatar, Tooltip } from "flowbite-svelte";
  import {
    Play,
    Pause,
    Forward,
    Backward,
    SpeakerWave,
    SpeakerXMark,
  } from "svelte-heros-v2";

  let audioPlayer: HTMLAudioElement;

  // --- LÓGICA MINIMALISTA ---

  // 1. Manejo de Audio (Igual que antes, robusto)
  $: if ($playerStore.currentSong && audioPlayer) {
    const newUrl = `${$playerStore.currentSong.song_path}`;
    if (audioPlayer.src !== new URL(newUrl, document.baseURI).href) {
      audioPlayer.src = newUrl;
      audioPlayer.load();
      if ($playerStore.isPlaying) audioPlayer.play().catch(() => {});
    }
  }

  $: if (audioPlayer) {
    if ($playerStore.isPlaying && audioPlayer.paused)
      audioPlayer.play().catch(() => {});
    if (!$playerStore.isPlaying && !audioPlayer.paused) audioPlayer.pause();
    audioPlayer.volume = $playerStore.volume;
  }

  // 2. Helpers UI
  const formatTime = (s: number) => {
    if (!s) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  // Validaciones para deshabilitar botones
  $: hasNext = $playerStore.currentIndex < $playerStore.queue.length - 1;
  $: hasPrev = $playerStore.currentIndex > 0;

  // En tu <script lang="ts">
  function handleSeek(e: Event) {
    const target = e.target as HTMLInputElement; // <--- Aquí hacemos la afirmación de tipo
    audioPlayer.currentTime = +target.value;
  }
</script>

<audio
  bind:this={audioPlayer}
  on:timeupdate={() => playerStore.updateTime(audioPlayer.currentTime)}
  on:loadedmetadata={() => playerStore.setDuration(audioPlayer.duration)}
  on:ended={() => playerStore.playNext()}
></audio>

{#if $playerStore.currentSong}
  <div class="fixed bottom-0 w-full z-50">
    <Footer
      class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-xl p-2"
    >
      <div
        class="container mx-auto flex items-center justify-between gap-4 h-16"
      >
        <div class="flex items-center gap-3 w-1/4">
          <Avatar
            src={`/img/${$playerStore.currentSong.cover_path}`}
            size="md"
          />
          <div class="hidden sm:block overflow-hidden">
            <p class="text-sm font-bold text-gray-900 dark:text-white truncate">
              {$playerStore.currentSong.title}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {$playerStore.queue.length > 0
                ? "En cola: " + $playerStore.queue.length
                : ""}
            </p>
          </div>
        </div>

        <div class="flex flex-col items-center flex-1 max-w-lg">
          <div class="flex items-center gap-4 mb-1">
            <Button
              pill
              color="light"
              size="xs"
              disabled={!hasPrev}
              onclick={() => playerStore.playPrevious()}
            >
              <Backward size="16" />
            </Button>

            <Button
              pill
              color="blue"
              size="lg"
              onclick={() => playerStore.togglePlay()}
              class="p-3"
            >
              {#if $playerStore.isPlaying}
                <Pause size="20" class="text-white" />
              {:else}
                <Play size="20" class="text-white" />
              {/if}
            </Button>

            <Button
              pill
              color="light"
              size="xs"
              disabled={!hasNext}
              onclick={() => playerStore.playNext()}
            >
              <Forward size="16" />
            </Button>
          </div>

          <div
            class="w-full flex items-center gap-2 text-xs text-gray-500 font-mono"
          >
            <span>{formatTime($playerStore.currentTime)}</span>
            <Range
              id="seek"
              size="sm"
              min="0"
              max={$playerStore.duration || 100}
              value={$playerStore.currentTime}
              onchange={handleSeek}
              class="cursor-pointer"
            />
            <span>{formatTime($playerStore.duration)}</span>
          </div>
        </div>

        <div class="flex items-center justify-end w-1/4 gap-2">
          <button
            class="text-gray-500"
            on:click={() =>
              playerStore.setVolume($playerStore.volume === 0 ? 1 : 0)}
          >
            {#if $playerStore.volume === 0}
              <SpeakerXMark size="18" />
            {:else}
              <SpeakerWave size="18" />
            {/if}
          </button>
          <div class="w-24">
            <Range
              value={$playerStore.volume}
              onchange={handleSeek}
            />
          </div>
        </div>
      </div>
    </Footer>
  </div>
{/if}
