import { create } from 'zustand';
import { DEFAULT_LAYOUTS } from '@/lib/layouts';
import { FRAMES } from '@/lib/frames';

// Helper to initialize slots based on layout
const createSlotsForLayout = (layoutId) => {
  const layout = DEFAULT_LAYOUTS.find(l => l.id === layoutId) || DEFAULT_LAYOUTS[0];
  return layout.slots.map((s, i) => ({
    id: s.id,
    index: i,
    imageUrl: null,
  }));
};

export const usePhotoboothStore = create((set, get) => ({
  // Config
  layouts: DEFAULT_LAYOUTS,
  frames: FRAMES, // Initialize with default frames
  
  // Initial State
  currentStep: 'CAPTURE',
  activeLayoutId: DEFAULT_LAYOUTS[0].id,
  slots: createSlotsForLayout(DEFAULT_LAYOUTS[0].id),
  activeFilterId: null,
  selectedFrameId: 'frame-1',
  customFrameUrl: null,
  
  // Flags
  isPrivacyAccepted: false,
  isVideoRecapEnabled: false,
  countdownDuration: 3,
  
  // Actions
  setStep: (step) => set({ currentStep: step }),
  
  setLayout: (layoutId) => {
    const currentLayoutId = get().activeLayoutId;
    if (currentLayoutId === layoutId) return;
    
    set({
      activeLayoutId: layoutId,
      slots: createSlotsForLayout(layoutId), // Reset slots when changing layout
    });
  },
  
  setFilter: (filterId) => set({ activeFilterId: filterId }),
  
  setFrame: (frameId) => set({ selectedFrameId: frameId, customFrameUrl: null }),
  
  setCustomFrame: (url) => set({ customFrameUrl: url, selectedFrameId: 'custom' }),
  
  updateSlot: (index, imageUrl) => set((state) => {
    const newSlots = [...state.slots];
    if (newSlots[index]) {
      newSlots[index] = { ...newSlots[index], imageUrl };
    }
    return { slots: newSlots };
  }),
  
  resetSlots: () => set((state) => ({
    slots: createSlotsForLayout(state.activeLayoutId)
  })),
  
  acceptPrivacy: () => set({ isPrivacyAccepted: true }),
  
  toggleVideoRecap: () => set((state) => ({ 
    isVideoRecapEnabled: !state.isVideoRecapEnabled 
  })),

  setCountdownDuration: (duration) => set({ countdownDuration: duration }),
}));
