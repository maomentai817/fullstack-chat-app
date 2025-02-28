import { generateToken } from '../lib/utils.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'

// 路由方法控制器挂载
export const signupHandler = async (req, res) => {
  // 注册相关数据结构
  const { fullName, email, password } = req.body
  try {
    // 非空校验
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: '填写完整信息' })
    }
    // 后端密码校验
    if (password.length < 6) { 
      return res.status(400).json({ message: '密码长度不能小于6位' })
    }
    // 邮箱校验
    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: '邮箱已被注册' })
    }
    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //todo 创建用户
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    })
    if (newUser) {
      //todo 生成 jwt token
      generateToken(newUser._id, res)
      await newUser.save()

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      })
    } else { 
      return res.status(400).json({ message: '无效的用户信息' })
    }

  } catch (error) {
    console.log(`Error in signup controller: ${error.message}`);
    res.status(500).json({ message: '服务器错误' })
  }
}

export const loginHandler = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    if (!user) { 
      return res.status(400).json({message: '用户不存在'})
    }
    // hash 密码校验
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) { 
      return res.status(400).json({message: '密码错误'})
    }

    // 生成 token
    generateToken(user._id, res)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })
  } catch (error) {
    console.log(`Error in login controller: ${error.message}`)
    res.status(500).json({ message: '服务器错误' })
  }
}

export const logoutHandler = async (req, res) => {
  try {
    //todo 清除 cookie
    res.cookie("jwt", "", { maxAge: 0 })
    
    res.status(200).json({ message: '退出成功' })
  } catch (error) {
    console.log(`Error in logout controller: ${error.message}`)
    res.status(500).json({ message: '服务器错误' })
  }
}

// 用户信息修改
export const updateProfileHandler = async (req, res) => {
  try {
    const { profilePic } = req.body
    const userId = req.user._id

    if (!profilePic) { 
      return res.status(400).json({ message: '请提供头像' })
    }

    // 上传图片到 cloudinary, 返回响应
    const uploadResponse = await cloudinary.uploader.upload(profilePic)

    // 验证用户是否存在, 更新 profilePic 字段存放地址
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

    res.status(200).json(updatedUser)
  } catch (error) {
    console.log(`Error in update profile controller: ${error.message}`)
    res.status(500).json({ message: '服务器错误' })
  }
}

// 身份校验
export const checkAuthHandler = async (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log(`Error in check auth controller: ${error.message}`)
    res.status(500).json({ message: '服务器错误' })
  }
}