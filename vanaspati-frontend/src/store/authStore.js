import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: window.localStorage.getItem('vanaspati_token') || null,
  isAuthenticated: Boolean(window.localStorage.getItem('vanaspati_token')),
  setAuth: ({ user, token }) => {
    window.localStorage.setItem('vanaspati_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    window.localStorage.removeItem('vanaspati_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
