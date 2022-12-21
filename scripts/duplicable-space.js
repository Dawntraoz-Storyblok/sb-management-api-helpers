/*
* Make a space duplicable using: https://app.storyblok.com/#!/build/[SB_SPACE_ID]
*/
import { makeStoryblokDuplicable } from '../helpers/index.js'
import dotenv from 'dotenv'
dotenv.config()

const storyblok = new makeStoryblokDuplicable({
  token: process.env.SB_MANAGEMENT_API_TOKEN,
  space_id: process.env.SB_SPACE_ID
})

const space = await storyblok.fetchSpace()
await storyblok.makeSpaceDuplicable(space)
