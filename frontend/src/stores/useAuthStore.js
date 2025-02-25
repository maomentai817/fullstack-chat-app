import { create } from 'zustand'
import toast from 'react-hot-toast'
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
  // 注册
  signUp: async (data) => { 
    set({ isSigningUp: true })
    try {
      const res = await instance.post('/auth/signup', data)
      set({ authUser: res.data })
      toast.success('注册成功')
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false })
    }
  }
}))