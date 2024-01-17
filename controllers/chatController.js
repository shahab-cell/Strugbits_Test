import asyncHandler from 'express-async-handler'
import Message from '../models/messagesModel.js'

const chatList = asyncHandler(async (req, res) => {
  const chats = await Message.find()
  res.status(200).json(chats)
})

const userChat = asyncHandler(async (req, res) => {
  const { userId } = req.body

  const userChats = await Message.find({ _id: { $in: userId } })
  res.status(200).json(userChats)
})

const deleteForMe = asyncHandler(async (req, res) => {
  const { messageId } = req.params.messageId
  const userId = req.params.userId

  try {
    // Update the message status for the current user
    await Message.updateOne(
      { _id: messageId, sender: userId },
      { $set: { deletedForUser: true } }
    )

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

const deleteForEveryone = asyncHandler(async (req, res) => {
  const messageId = req.params.messageId

  try {
    // Update the message status for everyone
    await Message.updateOne(
      { _id: messageId },
      { $set: { deletedForEveryone: true } }
    )

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

const search = asyncHandler(async (req, res) => {
  const query = req.params.query

  try {
    // Use MongoDB text search for users
    const userResults = await User.find({
      $text: { $search: query, $caseSensitive: false },
    })

    // Use MongoDB text search for messages
    const messageResults = await Message.find({
      $text: { $search: query, $caseSensitive: false },
    })

    res.json({ users: userResults, messages: messageResults })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export { chatList, userChat, deleteForMe, deleteForEveryone, search }
