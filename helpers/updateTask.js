import StoryblokClient from 'storyblok-js-client'

export default class updateTask {
  constructor(settings) {
    this.space_id = settings.space_id
    this.task_id = settings.task_id
    this.client = new StoryblokClient({
      oauthToken: settings.token,
      // region: 'us'
    })
  }

  /**
   * Fetch entries with "Page" Content Type
   */
  async fetchEntriesByContentType() {
    const res = await this.client.get(`spaces/${this.space_id}/stories`, {
      "story_only": true,
      filter_query: {
        component: { in: 'page' }
      },
      "per_page": 10
    })
    return res.data.stories
  }

  /**
   * Update the task dialog to have the latest 10 entries on the Content Type specified
   */
  async changeUserDialog() {
    const entries = await this.fetchEntriesByContentType();
    const res = await this.client.put(`spaces/${this.space_id}/tasks/${this.task_id}`, {
      user_dialog: {
        "articles": {
          "type": "option",
          "options": entries.map(entry => ({ "name": entry.name, "value": entry.slug })),
          "display_name": "Select the articles to share"
        }
      },
    });
    return res;
  }
}