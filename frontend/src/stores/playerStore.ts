import { writable } from 'svelte/store';
import type { Song } from '../types/api';

/**
 * Interface for the state of our global player.
 */
interface PlayerState {
  playlist: Song[];
  currentSongIndex: number;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

const initialPlayerState: PlayerState = {
  playlist: [],
  currentSongIndex: -1,
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.75,
};

const { subscribe, set, update } = writable<PlayerState>(initialPlayerState);

/**
 * Custom Svelte store with actions to control the music player.
 */
export const playerStore = {
  subscribe,
  set,
  update,

  /**
   * Plays a song from a playlist context.
   * @param song - The song object to play.
   * @param playlist - The array of songs that provides the context for next/previous.
   */
  playSong: (song: Song, playlist: Song[]) => {
    update(state => {
      const songIndex = playlist.findIndex(s => s.id_song === song.id_song);

      // If it's the same song, just toggle play/pause
      if (state.currentSong?.id_song === song.id_song) {
        return { ...state, isPlaying: !state.isPlaying };
      }

      // It's a new song or a new context
      return {
        ...state,
        playlist,
        currentSongIndex: songIndex,
        currentSong: song,
        isPlaying: true,
        currentTime: 0,
      };
    });
  },

  /**
   * Plays the next song in the current playlist.
   */
  playNext: () => {
    update(state => {
      const nextIndex = state.currentSongIndex + 1;
      if (nextIndex >= state.playlist.length) {
        // End of playlist, stop playing
        return { ...state, isPlaying: false };
      }
      return {
        ...state,
        currentSongIndex: nextIndex,
        currentSong: state.playlist[nextIndex],
        currentTime: 0,
        isPlaying: true,
      };
    });
  },

  /**
   * Plays the previous song in the current playlist.
   */
  playPrevious: () => {
    update(state => {
      const prevIndex = state.currentSongIndex - 1;
      if (prevIndex < 0) {
        // Before the start of the playlist, do nothing or stop
        return state;
      }
      return {
        ...state,
        currentSongIndex: prevIndex,
        currentSong: state.playlist[prevIndex],
        currentTime: 0,
        isPlaying: true,
      };
    });
  },

  /**
   * Toggles the play/pause state of the current song.
   */
  togglePlay: () => {
    update(state => {
      if (!state.currentSong) return state;
      return { ...state, isPlaying: !state.isPlaying };
    });
  },

  /**
   * Pauses the music.
   */
  pause: () => {
    update(state => ({ ...state, isPlaying: false }));
  },

  /**
   * Seeks to a specific time in the current song.
   * @param time - The time to seek to, in seconds.
   */
  seek: (time: number) => {
    update(state => ({ ...state, currentTime: time }));
  },

  /**
   * Sets the player volume.
   * @param volume - The volume level (0.0 to 1.0).
   */
  setVolume: (volume: number) => {
    // Clamp volume between 0 and 1
    const newVolume = Math.max(0, Math.min(1, volume));
    update(state => ({ ...state, volume: newVolume }));
  },
};

