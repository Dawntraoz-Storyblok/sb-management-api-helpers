/*
* Update task user_dialog using the Management API
*/
import { updateTask } from '../helpers/index.js'
import dotenv from 'dotenv'
dotenv.config()

const storyblok = new updateTask({
  token: process.env.SB_MANAGEMENT_API_TOKEN,
  space_id: process.env.SB_SPACE_ID,
  task_id: process.env.SB_TASK_ID,
})

await storyblok.changeUserDialog()
