import { generateToken } from '../lib/utils.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
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
  res.send('login route')
}

export const logoutHandler = async (req, res) => {
  res.send('logout route')
}