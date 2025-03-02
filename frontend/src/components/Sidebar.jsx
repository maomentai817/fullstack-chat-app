import { useEffect } from "react"
import { useChatStore } from "../stores/useChatStore"
import { useAuthStore } from "../stores/useAuthStore"
import SidebarSkeleton from "./skeletons/SidebarSkeleton"
import { Users } from 'lucide-react'

const Sidebar = () => {
  const { isUsersLoading, users, getUsers, selectedUser, setSelectedUser } = useChatStore()

  const { onlineUsers } = useAuthStore()

  useEffect(() => {
    getUsers()
  }, [getUsers])

  if (isUsersLoading) return <SidebarSkeleton />

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="hidden font-medium lg:block">Contacts</span>
        </div>
        {/* online filter toggle */}
      </div>
      {/* users list */}
      <div className="overflow-y-auto w-full py-3">
        {users.map(user => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors cursor-pointer
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            {/* avatar */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"></span>
              )}
            </div>
            {/* userinfo - only for large screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                { onlineUsers.includes(user._id) ? "Online" : "Offline" }
              </div>
            </div>
          </button>
        ))}

        {users.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar