/*
* Get space components by Nestable type using the Management API
*/
import { getNestableComponents } from '../helpers/index.js'
import dotenv from 'dotenv'
dotenv.config()

const storyblok = new getNestableComponents({
  token: process.env.SB_MANAGEMENT_API_TOKEN,
  space_id: process.env.SB_SPACE_ID
})

const components = await storyblok.fetchNestableComponents()
console.log(components.length)
