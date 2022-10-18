import StoryblokClient from 'storyblok-js-client'
import axios from 'axios'

export default class makeStoryblokDuplicable {
  constructor(settings) {
    this.space_id = settings.space_id
    this.client = new StoryblokClient({
      oauthToken: settings.token
    })
  }

  /**
   * Fetch the space settings data
   */
  async fetchSpace() {
    const res = await this.client.get(`spaces/${this.space_id}/`)
    return res.data.space
  }

  /**
   * Update space to be duplicable
   */
  async makeSpaceDuplicable(payload) {
    const newPayload = { ...payload, duplicatable: true };
    await this.client.put(`spaces/${this.space_id}/`, newPayload)
  }
}