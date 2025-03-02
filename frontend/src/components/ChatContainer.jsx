import { useChatStore } from '../stores/useChatStore'
import { useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'
import { useAuthStore } from '../stores/useAuthStore'
import { formatMessageTime } from "../lib/utils"
const ChatContainer = () => {
  const { messages, selectedUser, getMessages, isMessagesLoading } = useChatStore()
  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null)

  useEffect(() => {
    getMessages(selectedUser._id)
  }, [selectedUser._id, getMessages])

  if (isMessagesLoading) return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  )
  
  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      {/* chat-content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={ messageEndRef}
          >
            {/* avatar */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={ 
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profilePic"
                />
              </div>
            </div>
            {/* header */}
            <div className="chat-header mb-1">
              <time className='text-xs opacity-50 ml-1'>
                { formatMessageTime(message.createdAt) }
              </time>
            </div>
            {/* bubble */}
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="attachment"
                  className='sm:max-w-[200px] rounded-md mb-2'
                />
              )}
              { message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatContainer