# sb-management-api-helpers
Simple action scripts using the Management API

## Set up the repo
Install the dependencies:

```bash
npm install
```

Then, add a .env file with the Storyblok variables:

```txt
SB_MANAGEMENT_API_TOKEN=<your-personal-access-token>
SB_SPACE_ID=<space-ID>

# Migration between spaces scripts variables
SB_SPACE_A_ID=<SPACE-A-ID>
SB_SPACE_B_ID=<SPACE-B-ID>
```

## Actions

1. Make your space duplicable:

    ```bash
    npm run duplicable
    ```

2. Get all the folders from your space:

    ```bash
    npm run folders
    ```

3. Make your component fields translatable:

    Go to ./scripts/component-translatable.js and add the component details needed to make the fields translatable:

    ```js
    // Component Details
    component: {
      id: '', // Provided in the URL when opening the blok in the Block library
      name: '', // Technical name in the Config Tab
      fields: [
        // Fields name & type in lowercase
        { name: 'headline', type: 'text' },
        { name: 'teaser', type: 'textarea' },
      ]
    }
    ```

    Then you will be able to run:

    ```bash
    npm run component-translatable
    ```

4. Page History: Get the latest 25th story versions and the difference from each one

    Go to ./scripts/story-versions.js and add the story id:

    ```js
    story_id: '' // Provided in the URL when opening the story in the Visual Editor
    ```

    Then you will be able to run:

    ```bash
    npm run story-versions
    ```

5. Migrate or update first 100 pages from space A to space B:

    ```bash
    npm run share-content
    ```

6. Migrate first 25 assets from an old space to a new one:

    ```bash
    npm run migrate-assets
    ```