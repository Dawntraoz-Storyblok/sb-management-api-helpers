import StoryblokClient from 'storyblok-js-client'

export default class shareContent {
  constructor(settings) {
    this.space_a_id = settings.space_a_id
    this.space_b_id = settings.space_b_id
    this.client = new StoryblokClient({
      oauthToken: settings.token,
      // region: 'us'
    })
  }

  /**
   * Fetch space A entries
   */
  async fetchSpaceContent() {
    const Storyblok = new StoryblokClient({
      accessToken: this.space_a_id,
      // region: 'us'
    })
    const res = await this.client.get(`spaces/${this.space_a_id}/stories`, {
      "story_only": true,
      "per_page": 100
    })
    return res.data.stories
  }

  /**
   * Migrate to space B content from space A
   */
  async migrateContent() {
    const stories = await this.fetchSpaceContent()
  
    stories.map(async ({ id, slug }) => {
      const { data: { story } } = await this.client.get(`spaces/${this.space_a_id}/stories/${id}`)
      const storyExistId = (await this.client.get(`spaces/${this.space_b_id}/stories/`, { "with_slug": slug })).data.stories[0]?.id

      if (storyExistId) {
        await this.client.put(`spaces/${this.space_b_id}/stories/${storyExistId}`, { "story": story, "force_update": 1, "publish": 1 })
        console.log(`Story updated with the new content from space ${this.space_a_id} to ${this.space_b_id}.`)
      } else {
        await this.client.post(`spaces/${this.space_b_id}/stories/`, { "story": story, "publish": 1 })
        console.log(`New story created from ${this.space_a_id} at ${this.space_b_id}.`)
      }
    })
  }
}