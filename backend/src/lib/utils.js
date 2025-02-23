import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => { 
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days as ms
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks 跨域脚本攻击
    sameSite: 'strict', // CSRF attacks cross-site request forgery attacks 同源策略-禁止跨域请求
    secure: process.env.NODE_ENV !== 'development'  // 生产环境需要https
  })

  return token
}