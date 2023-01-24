import StoryblokClient from 'storyblok-js-client'

export default class getStoryVersions {
  constructor(settings) {
    this.space_id = settings.space_id
    this.story_id = settings.story_id
    this.client = new StoryblokClient({
      oauthToken: settings.token,
      // region: 'us'
    })
  }

  /**
   * Fetch the latest 25 page history versions
   */
  async fetchStoryVersions() {
    const res = await this.client.get(`spaces/${this.space_id}/stories/${this.story_id}/versions`)
    return res.data.versions
  }
  
  /**
   * Get all versions changes from the last 25th versions
   */
  async getVersionsComparison() {
    const versions = await this.fetchStoryVersions();

    const comparedVersions = {};
    const lastVersion = await this.client.get(`spaces/${this.space_id}/stories/${this.story_id}/compare`)
    comparedVersions['current-version'] = lastVersion.data;

    for (const version of versions) {
      const comparedVersion = await this.client.get(`spaces/${this.space_id}/stories/${this.story_id}/compare`, { version: version.id });
      const formattedAuthor = version.author.toLowerCase().replace(' ', '-');
      comparedVersions[`${formattedAuthor}-${version.id}`] = comparedVersion.data;
    }

    return comparedVersions;
  }
}