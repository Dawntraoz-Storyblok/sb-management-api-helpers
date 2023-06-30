import StoryblokClient from 'storyblok-js-client'
import FormData from 'form-data'

export default class migrateAssetsBetweenSpaces {
  constructor(settings) {
    this.space_a_id = settings.space_a_id
    this.space_b_id = settings.space_b_id
    this.client = new StoryblokClient({
      oauthToken: settings.token,
      // region: 'us'
    })
  }
  
  /**
   * Upload an existing asset to a new space
   */
  async uploadAsset(imageUrl) {
    return await this.client.post(`spaces/${this.space_b_id}/assets/`, {
      "filename": imageUrl.split('/').at(-1),
      "size": imageUrl.replace('https://', '').split('/')[3]
    }).then(async (response) => {

      let form = new FormData();
      const assetData = response.data;
      // 1. apply all fields from the signed response object to the second request
      for (let key in assetData.fields) {
        form.append(key, assetData.fields[key]);
      }
      
      // 2. also append the file buffer URL image
      const responseImage = await fetch(imageUrl, { method: 'GET' });
      const buffer = Buffer.from(await responseImage.arrayBuffer(), 'base64');
      form.append('file', buffer);

      // 3. submit your form
      form.submit(assetData.post_url, (err, res) => {
        if (err) throw err;
        
        // 4. finalize the upload
        this.client.get(`spaces/${this.space_b_id}/assets/${assetData.id}/finish_upload`).then(response => {
          console.log(`https://a.storyblok.com/${assetData.fields.key} uploaded!`);
        }).catch(error => {
          throw error;
        })
      });

      return `https://a.storyblok.com/${assetData.fields.key}`;
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * Migrate 25 first assets to the new space
   */
  async uploadAssets() {
    const { data: { assets } } = await this.client.get(`spaces/${this.space_a_id}/assets/`);
    
    assets.map(asset => {
      this.uploadAsset(asset.filename.replace('s3.amazonaws.com/', ''));
    });
  }
}


