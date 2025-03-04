import { create } from 'zustand'
import toast from 'react-hot-toast'
import { instance } from '../lib/instance'
import { io } from 'socket.io-client'
import { BASE_URL } from '../lib/instance'

export const useAuthStore = create((set, get) => ({
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

      get().connectSocket()
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
  },
  // 登出
  logout: async () => { 
    try {
      await instance.post('/auth/logout')
      set({ authUser: null })
      toast.success('登出成功')

      get().disconnectSocket()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },
  // 登录
  login: async (data) => { 
    set({ isLoggingIn: true })
    try {
      const res = await instance.post('/auth/login', data)
      set({ authUser: res.data })
      toast.success('登录成功')

      get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.message)
    } finally { 
      set({ isLoggingIn: false })
    }
  },
  // 修改头像
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const res = await instance.put('/auth/update-profile', data)
      set({ authUser: res.data })
      toast.success('修改成功')
    } catch (error) {
      toast.error(error.response.data.message)
    } finally { 
      set({ isUpdatingProfile: false })
    }
  },
  // 连接socket
  connectSocket: () => {
    const { authUser } = get()
    if (!authUser || get().socket?.connected)  return

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      }
    })
    socket.connect()

    set({ socket })
    // 监听在线用户列表
    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds })
    })
  },
  // 断开socket
  disconnectSocket: () => {
    if (get().socket?.connected)  get().socket.disconnect()
  },
}))