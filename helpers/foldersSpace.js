import StoryblokClient from 'storyblok-js-client'

export default class getAllFolders {
  constructor(settings) {
    this.space_id = settings.space_id
    this.client = new StoryblokClient({
      oauthToken: settings.token,
      // region: 'us'
    })
  }

  /**
   * Fetch the space folders data
   */
  async fetchFolders() {
    const res = await this.client.get(`spaces/${this.space_id}/stories/`, {
      folder_only: true,
    })
    return res.data.stories
  }
}