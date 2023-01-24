/*
* Make the chosen fields of your component translatable
*/
import { getStoryVersions } from '../helpers/index.js'
import dotenv from 'dotenv'
dotenv.config()

const storyblok = new getStoryVersions({
  token: process.env.SB_MANAGEMENT_API_TOKEN,
  space_id: process.env.SB_SPACE_ID,
  story_id: '',
})

const versionChanges = await storyblok.getVersionsComparison()
console.log(versionChanges);
