/*
* Migrate space A content to space B
*/
import { shareContent } from '../helpers/index.js'
import dotenv from 'dotenv'
dotenv.config()

const storyblok = new shareContent({
  token: process.env.SB_MANAGEMENT_API_TOKEN,
  space_a_id: process.env.SB_SPACE_A_ID,
  space_b_id: process.env.SB_SPACE_B_ID
})

await storyblok.migrateContent()
