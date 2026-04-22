import { create } from 'zustand';

const useFilterStore = create((set) => ({
  filters: {
    q: '',
    system: '',
    ailment: '',
    type: '',
    region: '',
    partUsed: '',
    rasa: '',
    season: '',
    sort: 'A-Z',
  },
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () =>
    set({
      filters: {
        q: '',
        system: '',
        ailment: '',
        type: '',
        region: '',
        partUsed: '',
        rasa: '',
        season: '',
        sort: 'A-Z',
      },
    }),
}));

export default useFilterStore;
