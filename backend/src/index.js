import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'

import { connectDB } from './lib/db.js'

import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { app, server } from './lib/socket.js'

// dotenv 包读取 .env 文件的环境变量
dotenv.config()

const PORT = process.env.PORT
const __dirname = path.resolve()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

// 登录凭证路由挂载
app.use('/api/auth', authRoutes)
// 消息路由挂载
app.use('/api/message', messageRoutes)

if (process.env.NODE_ENV === 'production') { 
  app.use(express.static(path.join(__dirname, '../frontend/dist')))

  app.get("*", (req, res) => { 
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
  })
}
server.listen(PORT, () => { 
  console.log(`server is running on port ${PORT}`)
  connectDB()
})