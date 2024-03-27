import StoryblokClient from "storyblok-js-client";

export default class appSpaceSettings {
  constructor(settings) {
    this.space_id = settings.space_id;
    this.app_id = settings.app_id;
    this.client = new StoryblokClient({
      oauthToken: settings.token,
      // region: 'us'
    });
  }

  /**
   * Add App Space Settings via MAPI
   */
  async addAppSpaceSettings() {
    const res = await this.client.put(
      `spaces/${this.space_id}/app_provisions/${this.app_id}`,
      {
        space_level_settings: {
          content_type: "site-config",
          story_slug: "site-config",
        },
      }
    );
    return res.data.app_provision.space_level_settings;
  }

  /**
   * Get App Space Settings via MAPI
   */
  async getAppSpaceSettings() {
    const res = await this.client.get(
      `spaces/${this.space_id}/app_provisions/${this.app_id}`
    );
    return res.data.app_provision.space_level_settings;
  }
}
