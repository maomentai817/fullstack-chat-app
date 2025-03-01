import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  // states
  theme: localStorage.getItem('chat-theme') || 'light',
  //actions
  setTheme: theme => { 
    localStorage.setItem('chat-theme', theme)
    set({ theme })
  },
}))