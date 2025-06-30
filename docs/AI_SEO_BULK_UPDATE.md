# Bulk AI SEO update script

This script enables bulk updates of Storyblok stories containing an AI SEO field plugin using **only the Management API (MAPI)**.

It targets stories with a specific content type that contains an AI SEO field and uses your custom AI API to generate optimized SEO metadata.

## Features

- **Management API**: Uses only the Storyblok Management API for all operations
- Fetches all stories with a specified content type using pagination
- Generates AI SEO meta tags for multiple stories
- **Content field cleaning**: Automatically removes system fields (starting with `_`) before updates
- Preserves existing non-AI SEO field values
- Supports dry-run mode for testing
- Comprehensive error handling and reporting
- Rate limiting to avoid API throttling
- Detailed progress and completion reports

## AI SEO meta tags

The script generates content for these SEO meta tags using AI:

- `title` - SEO optimized title (max 60 characters)
- `description` - Meta description (max 160 characters)
- `keywords` - Comma-separated keywords
- `og:title` - Open Graph title (max 60 characters)
- `og:description` - Open Graph description (max 160 characters)
- `twitter:title` - Twitter title (max 70 characters)
- `twitter:description` - Twitter description (max 200 characters)

## Preserved fields

These fields are preserved from existing content or set to defaults:

- `author`
- `og:url`
- `og:image`
- `twitter:card`
- `twitter:image`
- `advanced:robots`
- `advanced:charset`
- `advanced:refresh`
- `advanced:viewport`
- `advanced:alternate`
- `advanced:canonical`
- `advanced:content-type`

## Architecture

This script uses **only the Storyblok Management API (MAPI)** for all operations:

- **Authentication**: Uses `oauthToken` (Management API token) exclusively
- **Story Fetching**: Retrieves stories directly via Management API with content filtering
- **Content Updates**: Updates stories using Management API PUT operations
- **Field Cleaning**: Automatically removes system fields (those starting with `_`) from content before updates
- **No CDN API**: Does not require or use preview tokens or CDN API calls

This approach ensures:

- Consistent authentication model
- Direct access to draft content
- Proper content modification capabilities
- Simplified token management

## Setup

### 1. Environment configuration

Copy `.env.example` to `.env` and configure:

```bash
# Required for all operations
SB_MANAGEMENT_API_TOKEN=your_storyblok_management_api_token
SB_SPACE_ID=your_space_id
SB_CONTENT_TYPE=your_content_type_component_name
SB_SEO_FIELD_NAME=your_seo_field_name

# Required for AI generation (not needed for dry-run)
AI_API_URL=https://api.your-ai-provider.com/v1/generate
AI_API_TOKEN=your_ai_api_token
AI_CUSTOM_PROMPT="Your custom AI prompt for SEO generation"
```

### 2. Content Type setup

Ensure your Storyblok content type has an AI SEO field plugin included with the following structure:

```json
{
  "title": "",
  "author": "",
  "og:url": "",
  "keywords": "",
  "og:image": "",
  "og:title": "",
  "description": "",
  "twitter:card": "",
  "twitter:image": "",
  "twitter:title": "",
  "og:description": "",
  "advanced:robots": "",
  "advanced:charset": "",
  "advanced:refresh": "",
  "advanced:viewport": "",
  "advanced:alternate": "",
  "advanced:canonical": "",
  "twitter:description": "",
  "advanced:content-type": ""
}
```

### 3. AI API integration

The script is designed to work with various AI APIs. You'll need to:

1. **Configure your AI API endpoint** in `AI_API_URL`
2. **Set your API token** in `AI_API_TOKEN`
3. **Customize the prompt** in `AI_CUSTOM_PROMPT`
4. **Adapt the API call** in the `generateAiSeoContent` method if needed

#### Example AI API configurations

**OpenAI GPT:**

```bash
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_API_TOKEN=sk-your-openai-api-key
```

**Anthropic Claude:**

```bash
AI_API_URL=https://api.anthropic.com/v1/messages
AI_API_TOKEN=your-anthropic-api-key
```

## Usage

### Basic usage

```bash
npm run ai-seo-bulk-update
```

### Dry run (Test mode)

```bash
npm run ai-seo-bulk-update -- --dry-run
```

### With command line overrides

```bash
npm run ai-seo-bulk-update -- --space-id=12345 --content-type=blog_post --seo-field=seo_metadata
```

### Available command line arguments

- `--dry-run` - Run without making actual changes
- `--space-id=VALUE` - Override space ID from environment
- `--content-type=VALUE` - Override content type from environment
- `--seo-field=VALUE` - Override SEO field name from environment

## Customization

### Custom AI API integration

If you're using a different AI API, you may need to modify the `generateAiSeoContent` method in `/helpers/bulkAiSeoUpdate.js`:

1. **Request format** - Adjust the request body structure
2. **Response parsing** - Modify how the AI response is parsed
3. **Error handling** - Adapt error handling for your API's response format

### Management API customization

The script uses a single Management API client (`this.client`) for all operations. You can customize:

1. **Region settings** - Uncomment and set the `region` parameter if needed
2. **Content filtering** - Modify the `filter_query` in `fetchStoriesByContentType`
3. **Pagination size** - Adjust `per_page` parameter for different batch sizes
4. **Content cleaning** - Modify the `cleanContent` method for different field filtering rules

### Custom prompts

Customize the AI prompt by setting `AI_CUSTOM_PROMPT` in your environment variables. The prompt should instruct the AI to generate SEO content in the expected JSON format.

## Safety features

- **Dry run mode** for testing without changes
- **Content field cleaning** automatically removes system fields (starting with `_`) before updates
- **Error handling** continues processing other stories if one fails
- **Rate limiting** with delays between requests
- **Backup preservation** of existing field values
- **Comprehensive logging** of all operations and errors
- **Management API only** ensures consistent and reliable operations

## Output

The script provides detailed progress information:

- Individual story processing status
- Success/failure counts
- Error details for failed updates
- Final summary report

## Troubleshooting

### Common issues

1. **Missing environment variables** - Check all required variables are set
2. **Authentication errors** - Verify your Management API token has proper permissions
3. **AI API errors** - Verify API URL, token, and request format
4. **SEO field not found** - Ensure field name matches your content type
5. **Content update failures** - Check that system fields are being cleaned properly
6. **Rate limiting** - The script includes delays, but you may need to adjust them

### Error logs

All errors are logged with details about:

- Which story failed
- The specific error message
- API response details when available
- Suggestions for resolution

### Management API specific issues

- **Token permissions**: Ensure your Management API token has write access to stories
- **Content Type filtering**: Verify the content type name matches exactly
- **Field structure**: Check that the SEO field exists in your content type schema

## Performance

- Processes stories sequentially to avoid rate limiting
- Includes 1-second delays between API calls
- Pagination support for large content collections
- Memory-efficient processing of large datasets
