import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req, res, next) => { 
  try {
    //todo 验证用户登录状态, 成立则 next 进行用户信息修改
    const token = req.cookies.jwt

    if (!token) {
      return res.status(401).json({ message: '用户未登录' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded) { 
      return res.status(401).json({ message: 'token 无效或过期' })
    }
    // 数据库查找 user - utils 中 jwtToken 生成使用了 userId
    const user = await User.findById(decoded.userId).select('-password')  // 过滤 password
    if (!user) { 
      return res.status(404).json({ message: '用户不存在' })
    }

    //todo 已通过身份验证
    req.user = user
    next()
  } catch (error) {
    console.log(`Error in protectRoute middleware: ${error.message}`)
    res.status(500).json({ message: '服务器错误' })
  }
}