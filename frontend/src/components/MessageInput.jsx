import { useRef, useState } from "react"
import { X, Image, Send } from "lucide-react"
import { useChatStore } from "../stores/useChatStore"
import toast from "react-hot-toast"

const MessageInput = () => {
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)
  const { sendMessage } = useChatStore()
  
  const handleImageChange = (e) => { 
    const file = e.target.files[0]
    if (!file.type.startsWith("image/")) { 
      toast.error("Please select an image file.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => { 
      setImagePreview(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => { 
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSendMessage = async (e) => { 
    e.preventDefault()
    
    if (isLoading) return
    // 非空校验
    if (!text.trim() && !imagePreview) return
    
    try {
      setIsLoading(true)
      await sendMessage({
        text: text.trim(),
        image: imagePreview
      })
      // clear form
      setText("")
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (error) {
      console.error(`Failed to send message: ${error}`);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full p-4">
      {/* image preview part */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="preview" className="size-20 object-cover rounded-lg border border-zinc-700" />
            <button
              type="button"
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
              onClick={removeImage}
            >
              <X className="size-3 cursor-pointer hover:rotate-180 transition-transform duration-1200" />
            </button>
          </div>
        </div>
      )}
      {/* input */}
      <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          {/* btn for image */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        {/* btn for send */}
        <button
          type="submit"
          className="btn btn-circle"
          disabled={(!text.trim() && !imagePreview) || isLoading}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput