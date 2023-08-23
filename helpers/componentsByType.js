import StoryblokClient from 'storyblok-js-client'

export default class getNestableComponents {
  constructor(settings) {
    this.space_id = settings.space_id
    this.client = new StoryblokClient({
      oauthToken: settings.token,
      // region: 'us'
    })
  }

  /**
   * Fetch the Nestable components
   */
  async fetchNestableComponents() {
    const res = await this.client.get(`spaces/${this.space_id}/components/`)
    return res.data.components.filter(component => component.is_nestable)
  }
}