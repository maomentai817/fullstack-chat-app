import { create } from 'zustand'
import { instance } from '../lib/instance'

export const useAuthStore = create((set) => ({
  // state
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // actions
  checkAuth: async () => {
    try {
      const res = await instance.get('/auth/check') 

      set({ authUser: res.data })
    } catch (error) {
      console.log(`Error in checkAuth: ${error}`);
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },
}))