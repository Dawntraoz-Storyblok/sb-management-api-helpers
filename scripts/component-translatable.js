/*
* Make the chosen fields of your component translatable
*/
import { makeComponentTranslatable } from '../helpers/index.js'
import dotenv from 'dotenv'
dotenv.config()

const storyblok = new makeComponentTranslatable({
  token: process.env.SB_MANAGEMENT_API_TOKEN,
  space_id: process.env.SB_SPACE_ID,
  component: {
    id: '',
    name: '',
    fields: [ // Sample fields
      { name: 'headline', type: 'text' },
      { name: 'subheadline', type: 'text' },
      { name: 'teaser', type: 'textarea' },
    ]
  }
})

await storyblok.updateComponentFields()
