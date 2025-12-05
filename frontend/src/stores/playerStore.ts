import { writable } from 'svelte/store';
import type { Song } from '../types/api';

/**
 * Interface for the state of our global player.
 */
interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

const initialPlayerState: PlayerState = {
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
   * Plays a new song or toggles play/pause for the current song.
   * @param song - The song to play. If null, toggles the current song.
   */
  playSong: (song: Song) => {
    update(state => {
      // If it's the same song, just toggle play/pause
      if (state.currentSong?.id_song === song.id_song) {
        return { ...state, isPlaying: !state.isPlaying };
      }
      // If it's a new song, start playing it from the beginning
      return { 
        ...state, 
        currentSong: song, 
        isPlaying: true, 
        currentTime: 0 
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
