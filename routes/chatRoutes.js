import express from 'express'
import {
  chatList,
  deleteForEveryone,
  deleteForMe,
  search,
  userChat,
} from '../controllers/chatController.js'
const router = express.Router()

router.post('/', chatList)
router.post('/userchat', userChat)
router.delete('/deleteForMe/:messageId/:userId', deleteForMe)
router.delete('/deleteForEveryone/:messageId', deleteForEveryone)
router.get('/search/:query', search)
export default router
