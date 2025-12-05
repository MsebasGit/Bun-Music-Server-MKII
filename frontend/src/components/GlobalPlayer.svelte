<script lang="ts">
  import { onMount } from 'svelte';
  import { playerStore } from '../stores/playerStore';
  import { Button, Progressbar, Avatar, Tooltip } from 'flowbite-svelte';
  import { Play, Pause, SpeakerWave, SpeakerXMark } from 'svelte-heros-v2';

  let audioPlayer: HTMLAudioElement;
  let isMuted = false;
  let lastVolume = $playerStore.volume;
  
  // Reactive statement to sync the audio element with the store
  $: if (audioPlayer && $playerStore.currentSong) {
    // Change source if song is different
    const songUrl = $playerStore.currentSong.song_path;
    if (songUrl && audioPlayer.src !== songUrl) {
      audioPlayer.src = songUrl;
    }
    
    // Sync play/pause state
    if ($playerStore.isPlaying) {
      audioPlayer.play().catch(e => console.error("Audio playback failed.", e));
    } else {
      audioPlayer.pause();
    }
    
    // Sync volume
    audioPlayer.volume = $playerStore.volume;
  }
  
  // Seek handling
  function handleSeek(e: MouseEvent) {
    if (!$playerStore.duration) return;
    const progressContainer = e.currentTarget as HTMLElement;
    const clickPosition = e.clientX - progressContainer.getBoundingClientRect().left;
    const percentage = clickPosition / progressContainer.clientWidth;
    const newTime = $playerStore.duration * percentage;
    audioPlayer.currentTime = newTime;
    playerStore.seek(newTime);
  }
  
  // Volume handling
  function handleVolumeChange(e: Event) {
    const newVolume = parseFloat((e.target as HTMLInputElement).value);
    playerStore.setVolume(newVolume);
  }

  function toggleMute() {
    if (isMuted) {
      playerStore.setVolume(lastVolume);
      isMuted = false;
    } else {
      lastVolume = $playerStore.volume;
      playerStore.setVolume(0);
      isMuted = true;
    }
  }
  
  // Time formatting utility
  function formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Update mute state based on volume
  $: isMuted = $playerStore.volume === 0;
</script>

<!-- The actual audio element, hidden from view -->
<audio 
  bind:this={audioPlayer}
  on:timeupdate={() => playerStore.update(s => ({...s, currentTime: audioPlayer.currentTime}))}
  on:loadedmetadata={() => playerStore.update(s => ({...s, duration: audioPlayer.duration}))}
  on:ended={() => playerStore.togglePlay()}
></audio>

{#if $playerStore.currentSong}
  <div class="fixed bottom-0 left-0 right-0 h-24 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 z-50">
    <div class="container mx-auto h-full px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-full gap-4">
        
        <!-- Song Info -->
        <div class="flex items-center gap-3 w-1/4 min-w-0">
          <Avatar src={$playerStore.currentSong.cover_path || '/default-cover.png'} size="md" />
          <div class="truncate">
            <p class="font-bold text-sm text-gray-900 dark:text-white truncate">{$playerStore.currentSong.title}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{$playerStore.currentSong.artist_names || 'Unknown Artist'}</p>
          </div>
        </div>

        <!-- Playback Controls & Progress -->
        <div class="flex flex-col items-center justify-center flex-grow">
          <button on:click={() => playerStore.togglePlay()} class="mb-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white">
            {#if $playerStore.isPlaying}
              <Pause class="w-5 h-5" />
            {:else}
              <Play class="w-5 h-5" />
            {/if}
          </button>
          <div class="flex items-center gap-2 w-full max-w-md">
            <span class="text-xs font-mono text-gray-500 dark:text-gray-400">{formatTime($playerStore.currentTime)}</span>
            <div 
              role="slider"
              aria-valuemin="0"
              aria-valuemax={$playerStore.duration}
              aria-valuenow={$playerStore.currentTime}
              aria-valuetext={`progreso: ${formatTime($playerStore.currentTime)} de ${formatTime($playerStore.duration)}`}
              tabindex="0"
              class="w-full cursor-pointer" 
              on:click={handleSeek}
              on:keydown={(e) => {
                if (e.key === 'ArrowRight') audioPlayer.currentTime += 5;
                if (e.key === 'ArrowLeft') audioPlayer.currentTime -= 5;
              }}
            >
                <Progressbar 
                    progress={($playerStore.currentTime / $playerStore.duration * 100) || 0} 
                    color="blue"
                    size="h-1.5" 
                />
            </div>
            <span class="text-xs font-mono text-gray-500 dark:text-gray-400">{formatTime($playerStore.duration)}</span>
          </div>
        </div>

        <!-- Volume Control -->
        <div class="flex items-center gap-2 w-1/4 justify-end">
            <button on:click={toggleMute} class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                {#if isMuted}
                    <SpeakerXMark class="w-5 h-5"/>
                {:else}
                    <SpeakerWave class="w-5 h-5"/>
                {/if}
            </button>
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                bind:value={$playerStore.volume}
                on:input={handleVolumeChange}
                class="w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
        </div>
      </div>
    </div>
  </div>
{/if}
