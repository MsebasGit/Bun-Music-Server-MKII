import { writable } from 'svelte/store';

// Definimos la estructura básica
interface PlayerState {
  isPlaying: boolean;
  currentSong: any | null; // Tu tipo Song
  queue: any[];            // <--- ESTA ES LA CLAVE: La lista de contexto actual
  currentIndex: number;
  volume: number;
  duration: number;
  currentTime: number;
}

const initialState: PlayerState = {
  isPlaying: false,
  currentSong: null,
  queue: [], 
  currentIndex: -1,
  volume: 1,
  duration: 0,
  currentTime: 0
};

function createPlayerStore() {
  const { subscribe, update, set } = writable(initialState);

  return {
    subscribe,
    setVolume: (v: number) => update(s => ({ ...s, volume: v })),
    
    // ACCIÓN MAESTRA: Play con Contexto
    // Cuando haces click en una canción en la UI, pasas la canción Y la lista donde está
    playContext: (song: any, contextList: any[]) => {
      const index = contextList.findIndex(s => s.id_song === song.id_song);
      update(s => ({
        ...s,
        isPlaying: true,
        currentSong: song,
        queue: contextList, // Guardamos el contexto actual (Home, Playlist, etc)
        currentIndex: index
      }));
    },

    togglePlay: () => update(s => ({ ...s, isPlaying: !s.isPlaying })),

    playNext: () => update(s => {
      // Si no hay siguiente, no hacemos nada o volvemos al inicio (loop)
      if (s.currentIndex >= s.queue.length - 1) return s; 
      
      const nextIndex = s.currentIndex + 1;
      return {
        ...s,
        currentIndex: nextIndex,
        currentSong: s.queue[nextIndex],
        isPlaying: true
      };
    }),

    playPrevious: () => update(s => {
      if (s.currentIndex <= 0) return s;
      
      const prevIndex = s.currentIndex - 1;
      return {
        ...s,
        currentIndex: prevIndex,
        currentSong: s.queue[prevIndex],
        isPlaying: true
      };
    }),

    // Helpers para actualizar tiempos desde el componente de audio
    updateTime: (time: number) => update(s => ({ ...s, currentTime: time })),
    setDuration: (d: number) => update(s => ({ ...s, duration: d })),
  };
}

export const playerStore = createPlayerStore();