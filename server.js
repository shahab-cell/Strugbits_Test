import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import http from 'http' // Add the import statement for http
import cookieParser from 'cookie-parser'
import path from 'path'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import Message from './models/messagesModel.js'
import { Server } from 'socket.io'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import xss from 'xss'

const app = express()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

app.use(limiter)
app.use(helmet())
app.use(xss())

const server = http.createServer(app) // Create an HTTP server using the express app
const io = new Server(server)
await connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api/users', userRoutes)
app.use('/api/chats', chatRoutes)

// if (process.env.NODE_ENV === 'production') {
//   const __dirname = path.resolve()
//   app.use(express.static(path.join(__dirname, 'frontend/dist')))

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
//   })
// } else {
app.get('/', (req, res) => {
  res.send('server is ready')
})

//   })
// }

app.use(notFound)
app.use(errorHandler)

io.on('connection', (socket) => {
  console.log('A user connected')

  // Listen for chat messages
  socket.on('message', async (message) => {
    console.log(`Received message: ${message.text}`)

    // Save the message to the database
    const newMessage = new Message({
      text: message.text,
      sender: message.sender,
      receiver: message.receiver,
    })

    try {
      await newMessage.save()
      console.log('Message saved to the database')
    } catch (error) {
      console.error('Error saving message:', error)
    }

    // Broadcast the message to all connected clients
    io.emit('message', message)
  })

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

const port = 8000

server.listen(port, () => {
  console.log(`server started on port ${port}`)
})
