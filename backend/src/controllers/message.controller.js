import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getSocketIdByUserId, io } from "../lib/socket.js"

export const getUsersForSiderbar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id
    //todo 获取除自身外的所有用户-筛除 pwd
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
    
    res.status(200).json(filteredUsers)
  } catch (error) {
    console.log(`Error in getUsersForSiderbar controller: ${error.message}`)
    res.status(500).json({ message: '服务器错误' })
  }
}

export const getMessages = async (req, res) => { 
  try {
    const { id: userToChatId } = req.params
    const myId = req.user._id

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    })

    res.status(200).json(messages)
  } catch (error) {
    console.log(`Error in getMessages controller: ${error.message}`)
    res.status(500).json({ message: '服务器错误' })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body
    const { id: receiverId } = req.params
    const senderId = req.user._id

    //todo 图像处理
    let imageUrl
    if (image) { 
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }

    // 创建 Msg 对象
    const newMessage = new Message({
      text,
      image: imageUrl,
      senderId,
      receiverId,
    })

    // 保存到数据库
    await newMessage.save()

    //! todo - realtime functionality goes here => socket.io
    const receiverSocketId = getSocketIdByUserId(receiverId)
    // 接收方在线, 实时通知
    if (receiverSocketId) { 
      io.to(receiverSocketId).emit('newMessage', newMessage)
    }

    // 资源已创建
    res.status(201).json(newMessage)

  } catch (error) {
    console.log(`Error in sendMessage controller: ${error.message}`)
    res.status(500).json({ message: '服务器错误' })
  }
}