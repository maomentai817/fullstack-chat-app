import { X } from "lucide-react"
import { useAuthStore } from '../stores/useAuthStore'
import { useChatStore } from "../stores/useChatStore"
const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore()
  const { onlineUsers } = useAuthStore()

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center fap-3">
          {/* avatar */}
          <div className="avatar pr-1">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={ selectedUser.fullName} />
            </div>
          </div>
          {/* user info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              { onlineUsers.includes(selectedUser._id) ? "Online" : "Offline" }
            </p>
          </div>
        </div>
        {/* close btn */}
        <button onClick={() => setSelectedUser(null)} className="cursor-pointer">
          <X className="hover:rotate-180 transition-all duration-1200" />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader