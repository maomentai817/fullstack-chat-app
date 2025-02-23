import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import { connectDB } from './lib/db.js'

import authRoutes from './routes/auth.route.js'

// dotenv 包读取 .env 文件的环境变量
dotenv.config()
const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())

// 登录凭证路由挂载
app.use('/api/auth', authRoutes)

app.listen(PORT, () => { 
  console.log(`server is running on port ${PORT}`)
  connectDB()
})