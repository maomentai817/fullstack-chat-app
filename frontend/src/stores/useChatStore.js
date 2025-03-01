import { create } from 'zustand'
import { instance } from '../lib/instance'
import toast from 'react-hot-toast'

export const useChatStore = create((set) => ({
  // states
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  //actions
  getUsers: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await instance.get('/message/users')
      set({ users: res.data })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUsersLoading: false })
    }
  },
  getMessages: async (userId) => { 
    set({ isMessagesLoading: true })
    try {
      const res = await instance.get(`/message/${userId}`)
      set({ messages: res.data })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally { 
      set({ isMessagesLoading: false })
    }
  },
  //todo - 待补全
  setSelectedUser: (selectedUser) => { 
    set({ selectedUser })
  },
}))