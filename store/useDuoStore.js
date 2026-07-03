import { create } from 'zustand';

export const useDuoStore = create((set, get) => ({
  // identity
  roomId: null,
  role: null,               // 'host' | 'guest'
  connectionState: 'idle',   // 'idle'|'connecting'|'connected'|'reconnecting'|'error'
  peerPresent: false,

  // session
  phase: 'LOBBY',            // 'LOBBY'|'CAPTURE'|'EXPORT'
  currentRound: 1,           // 1..4
  totalRounds: 4,
  captureLock: null,         // null | { round, lockedBy: 'host'|'guest' }
  countdown: null,           // null | number (seconds remaining)
  photos: {},                // { [round]: { host?: dataUrl, guest?: dataUrl } }

  // shared selections (last-write-wins)
  activeFilterId: null,
  selectedFrameId: 'frame-1',

  // presence
  remoteCursor: null,        // { x, y } normalized 0..1
  remoteCursorTimestamp: null,

  // Actions
  initSession: ({ roomId, role }) => set({
    roomId,
    role,
    phase: 'LOBBY',
    currentRound: 1,
    captureLock: null,
    countdown: null,
    photos: {},
    activeFilterId: null,
    selectedFrameId: 'frame-1',
    remoteCursor: null,
    remoteCursorTimestamp: null,
    peerPresent: false
  }),

  setConnectionState: (connectionState) => set({ connectionState }),
  
  setPeerPresent: (peerPresent) => set({ peerPresent }),
  
  setPhase: (phase) => set({ phase }),
  
  setCaptureLock: (captureLock) => set({ captureLock }),
  
  clearCaptureLock: () => set({ captureLock: null }),
  
  setCountdown: (countdown) => set({ countdown }),
  
  setPhoto: (round, role, dataUrl) => set((state) => {
    const newPhotos = { ...state.photos };
    if (!newPhotos[round]) {
      newPhotos[round] = {};
    }
    newPhotos[round] = { ...newPhotos[round], [role]: dataUrl };
    return { photos: newPhotos };
  }),
  
  retakeRound: (round) => set((state) => {
    const newPhotos = { ...state.photos };
    delete newPhotos[round];
    
    // Set currentRound to the retaken round if it is less than currentRound
    return {
      photos: newPhotos,
      currentRound: round,
      captureLock: null,
      countdown: null,
      phase: 'CAPTURE' // Ensure we are back in CAPTURE if we retake from EXPORT
    };
  }),
  
  advanceRoundIfComplete: () => set((state) => {
    const roundPhotos = state.photos[state.currentRound];
    if (roundPhotos && roundPhotos.host && roundPhotos.guest) {
      const nextRound = state.currentRound + 1;
      if (nextRound > state.totalRounds) {
        return {
          phase: 'EXPORT',
          captureLock: null
        };
      } else {
        return {
          currentRound: nextRound,
          captureLock: null
        };
      }
    }
    return {};
  }),
  
  setFilter: (activeFilterId) => set({ activeFilterId }),
  
  setFrame: (selectedFrameId) => set({ selectedFrameId }),
  
  setRemoteCursor: (remoteCursor) => set({
    remoteCursor,
    remoteCursorTimestamp: Date.now()
  }),
  
  getSnapshot: () => {
    const { currentRound, photos, activeFilterId, selectedFrameId, phase } = get();
    return { currentRound, photos, activeFilterId, selectedFrameId, phase };
  },
  
  applySnapshot: (snapshot) => {
    if (!snapshot) return;
    set({
      currentRound: snapshot.currentRound ?? 1,
      photos: snapshot.photos ?? {},
      activeFilterId: snapshot.activeFilterId ?? null,
      selectedFrameId: snapshot.selectedFrameId ?? 'frame-1',
      phase: snapshot.phase ?? 'LOBBY'
    });
  },
  
  resetSession: () => set({
    phase: 'CAPTURE',
    currentRound: 1,
    captureLock: null,
    countdown: null,
    photos: {},
    activeFilterId: null,
    selectedFrameId: 'frame-1',
    remoteCursor: null,
    remoteCursorTimestamp: null
  })
}));

// Session storage persistence
if (typeof window !== 'undefined') {
  let debounceTimeout = null;
  useDuoStore.subscribe((state) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (!state.roomId || !state.role) return;
      const dataToSave = {
        roomId: state.roomId,
        role: state.role,
        snapshot: {
          currentRound: state.currentRound,
          photos: state.photos,
          activeFilterId: state.activeFilterId,
          selectedFrameId: state.selectedFrameId,
          phase: state.phase
        }
      };
      sessionStorage.setItem('prismo-duo-session', JSON.stringify(dataToSave));
    }, 300);
  });
}

export function loadPersistedSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('prismo-duo-session');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Error loading persisted session:", e);
    return null;
  }
}
