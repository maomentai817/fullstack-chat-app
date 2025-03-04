import { create } from 'zustand'
import { instance } from '../lib/instance'
import toast from 'react-hot-toast'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set, get) => ({
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
  sendMessage: async (messageData) => { 
    const { selectedUser, messages } = get()
    try {
      const res = await instance.post(`/message/send/${selectedUser._id}`, messageData)
      set({ messages: [...messages, res.data] })
    } catch (error) { 
      toast.error(error.response.data.message)
    }
  },
  subscribeToMessages: () => { 
    const { selectedUser } = get()
    if (!selectedUser) return
    
    const socket = useAuthStore.getState().socket
    socket.on('newMessage', (newMessage) => { 
      const isMessageSendFromSelectedUser = newMessage.sender._id === selectedUser._id
      if (!isMessageSendFromSelectedUser) return
      set({ messages: [...get().messages, newMessage] })
    })
  },
  unsubscribeFromMessage: () => { 
    const socket = useAuthStore.getState().socket
    socket.off('newMessage')
  },
  //todo - 待补全
  setSelectedUser: (selectedUser) => { 
    set({ selectedUser })
  },
}))