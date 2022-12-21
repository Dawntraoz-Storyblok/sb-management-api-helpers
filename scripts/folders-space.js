/*
* Get space folders using the Management API
*/
import { getAllFolders } from '../helpers/index.js'
import dotenv from 'dotenv'
dotenv.config()

const storyblok = new getAllFolders({
  token: process.env.SB_MANAGEMENT_API_TOKEN,
  space_id: process.env.SB_SPACE_ID
})

const folders = await storyblok.fetchFolders()
console.log(folders)
