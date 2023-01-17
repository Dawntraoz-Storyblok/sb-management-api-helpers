import StoryblokClient from 'storyblok-js-client'

export default class makeComponentTranslatable {
  constructor(settings) {
    this.space_id = settings.space_id
    this.client = new StoryblokClient({
      oauthToken: settings.token,
      // region: 'us'
    })
    this.component = settings.component
  }

  /**
   * Fetch the original component data
   */
  async fetchComponentSchema() {
    const res = await this.client.get(`spaces/${this.space_id}/components/${this.component.id}`, {})
    return res.data.component.schema
  }
  
  /**
   * Update component fields to be translatable
   */
  async updateComponentFields() {
    // Get current component schema
    const initialSchema = await this.fetchComponentSchema();

    // Override the translatable fields provided in the constructor
    const schema = {
      ...initialSchema,
      ...this.component.fields.reduce((schema, field) => ({
        ...schema,
        [field.name]: { translatable: true, type: field.type }
      }), {})
    };

    // Add new translatable fields sending the combined schema
    const res = await this.client.put(`spaces/${this.space_id}/components/${this.component.id}`, {
      component: {
        name: this.component.name,
        schema,
      },
    });

    return res;
  }
}