import StoryblokClient from "storyblok-js-client";

export default class bulkAiSeoUpdate {
  constructor(settings) {
    this.space_id = settings.space_id;
    this.content_type = settings.content_type;
    this.seo_field_name = settings.seo_field_name;
    this.ai_api_url = settings.ai_api_url;
    this.ai_api_token = settings.ai_api_token;
    this.custom_prompt = settings.custom_prompt;

    // Management API client for all operations (MAPI only)
    this.client = new StoryblokClient({
      oauthToken: settings.token,
      // region: 'us'
    });
  }

  /**
   * Fetch stories with the specified content type that have the AI SEO field
   */
  async fetchStoriesByContentType(page = 1, per_page = 25) {
    try {
      const res = await this.client.get(`spaces/${this.space_id}/stories`, {
        story_only: true,
        filter_query: {
          component: { in: this.content_type },
        },
        per_page,
        page,
      });
      return {
        stories: res.data.stories,
        total: res.total,
        per_page: res.per_page,
      };
    } catch (error) {
      console.error("Error fetching stories:", error.message);
      throw error;
    }
  }

  /**
   * Fetch all stories with pagination
   */
  async fetchAllStories() {
    let allStories = [];
    let page = 1;
    let hasMore = true;

    console.log(`Fetching stories with content type: ${this.content_type}`);

    while (hasMore) {
      const result = await this.fetchStoriesByContentType(page);
      allStories = allStories.concat(result.stories);

      console.log(`Fetched page ${page}: ${result.stories.length} stories`);

      hasMore = result.stories.length === result.per_page;
      page++;
    }

    console.log(`Total stories found: ${allStories.length}`);
    return allStories;
  }

  /**
   * Generate AI content for SEO fields
   */
  async generateAiSeoContent(storyContent, storyName) {
    if (!this.ai_api_url || !this.ai_api_token) {
      throw new Error(
        "AI API URL and token are required for content generation"
      );
    }

    try {
      // Create a prompt that includes the story content and custom instructions
      const prompt = `${this.custom_prompt}
      
Story Title: ${storyName}
Story Content: ${JSON.stringify(storyContent, null, 2)}

Please generate SEO content in the following JSON format:
{
  "title": "SEO optimized title (max 60 characters)",
  "description": "SEO meta description (max 160 characters)",
  "keywords": "comma-separated keywords",
  "og:title": "Open Graph title (max 60 characters)",
  "og:description": "Open Graph description (max 160 characters)",
  "twitter:title": "Twitter title (max 70 characters)",
  "twitter:description": "Twitter description (max 200 characters)"
}`;

      // Make request to AI API - this is a generic structure for Anthropic models that can be adapted to other AI APIs
      const aiResponse = await (
        await fetch(this.ai_api_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.ai_api_token,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
            model: "claude-opus-4-20250514",
          }),
        })
      ).json();

      if (!aiResponse) {
        throw new Error(
          `AI API request failed: ${aiResponse.status} ${aiResponse.statusText}`
        );
      }
      // Parse the AI response - this might need adjustment based on your AI API response format
      let generatedContent;
      try {
        // Assuming the AI returns the content in a 'content' or 'choices' field
        const aiText = aiResponse.content[0].text
          .replace("```json", "")
          .replace("```", "")
          .trim();
        generatedContent = JSON.parse(aiText);
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError.message);
        console.log("AI Response:", aiResponse);
        throw new Error("Failed to parse AI generated content as JSON");
      }

      return generatedContent;
    } catch (error) {
      console.error(
        `Error generating AI content for story "${storyName}":`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Create the complete SEO field content with AI-generated and default values
   */
  createSeoFieldContent(aiGeneratedContent, existingContent = {}) {
    return {
      // AI-generated fields
      title: aiGeneratedContent.title || "",
      description: aiGeneratedContent.description || "",
      keywords: aiGeneratedContent.keywords || "",
      "og:title": aiGeneratedContent["og:title"] || "",
      "og:description": aiGeneratedContent["og:description"] || "",
      "twitter:title": aiGeneratedContent["twitter:title"] || "",
      "twitter:description": aiGeneratedContent["twitter:description"] || "",

      // Preserve existing values or set defaults for non-AI fields
      author: existingContent.author || "",
      "og:url": existingContent["og:url"] || "",
      "og:image": existingContent["og:image"] || "",
      "twitter:card": existingContent["twitter:card"] || "summary_large_image",
      "twitter:image": existingContent["twitter:image"] || "",
      "advanced:robots": existingContent["advanced:robots"] || "",
      "advanced:charset": existingContent["advanced:charset"] || "",
      "advanced:refresh": existingContent["advanced:refresh"] || "",
      "advanced:viewport": existingContent["advanced:viewport"] || "",
      "advanced:alternate": existingContent["advanced:alternate"] || "",
      "advanced:canonical": existingContent["advanced:canonical"] || "",
      "advanced:content-type": existingContent["advanced:content-type"] || "",
    };
  }

  /**
   * Update a single story with AI-generated SEO content
   */
  async updateStorySeo(story) {
    try {
      console.log(`Processing story: ${story.name} (ID: ${story.id})`);

      // Fetch full story using Management API only
      const managementResponse = await this.client.get(
        `spaces/${this.space_id}/stories/${story.id}`
      );
      const fullStory = managementResponse.data.story;

      // Generate AI content
      const aiGeneratedContent = await this.generateAiSeoContent(
        fullStory.content,
        story.name
      );

      // Create the complete SEO field content
      const updatedSeoContent = this.createSeoFieldContent(
        aiGeneratedContent,
        fullStory.content[this.seo_field_name] || {}
      );

      // Update the story
      const cleanedContent = this.cleanContent(fullStory.content);
      cleanedContent[this.seo_field_name] = updatedSeoContent;

      const updatedStory = {
        ...fullStory,
        content: cleanedContent,
      };

      await this.client.put(`spaces/${this.space_id}/stories/${story.id}`, {
        story: updatedStory,
        force_update: 1,
      });

      console.log(`✅ Successfully updated story: ${story.name}`);
      return { success: true, updatedFields: Object.keys(aiGeneratedContent) };
    } catch (error) {
      console.error(`❌ Error updating story "${story.name}":`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Clean content object by removing fields that start with underscore
   */
  cleanContent(content) {
    if (!content || typeof content !== "object") {
      return content;
    }

    const cleanedContent = {};

    for (const [key, value] of Object.entries(content)) {
      // Skip fields that start with underscore (system fields like _uid, _editable, etc.)
      if (key.startsWith("_")) {
        continue;
      }

      // Include all other fields
      cleanedContent[key] = value;
    }

    return cleanedContent;
  }

  /**
   * Process all stories with AI SEO updates
   */
  async processBulkSeoUpdates(dryRun = false) {
    try {
      console.log("🚀 Starting bulk AI SEO updates...");
      console.log(`Space ID: ${this.space_id}`);
      console.log(`Content Type: ${this.content_type}`);
      console.log(`SEO Field Name: ${this.seo_field_name}`);
      console.log(`Dry Run: ${dryRun}`);
      console.log("---");

      // Fetch all stories
      const stories = await this.fetchAllStories();

      if (stories.length === 0) {
        console.log("No stories found with the specified content type.");
        return;
      }

      const results = {
        total: stories.length,
        successful: 0,
        failed: 0,
        skipped: 0,
        errors: [],
      };

      // Process each story
      for (let i = 0; i < stories.length; i++) {
        const story = stories[i];
        console.log(
          `\n[${i + 1}/${stories.length}] Processing story: ${story.name}`
        );

        if (dryRun) {
          console.log("🔍 DRY RUN - Would process this story");
          results.successful++;
          continue;
        }

        const result = await this.updateStorySeo(story);

        if (result.success) {
          results.successful++;
        } else if (result.reason === "No SEO field found") {
          results.skipped++;
        } else {
          results.failed++;
          results.errors.push({
            story: story.name,
            id: story.id,
            error: result.error,
          });
        }

        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Print summary
      console.log("\n📊 SUMMARY");
      console.log("---");
      console.log(`Total stories: ${results.total}`);
      console.log(`✅ Successful updates: ${results.successful}`);
      console.log(`⏭️  Skipped (no SEO field): ${results.skipped}`);
      console.log(`❌ Failed updates: ${results.failed}`);

      if (results.errors.length > 0) {
        console.log("\n❌ ERRORS:");
        results.errors.forEach((error) => {
          console.log(`- ${error.story} (ID: ${error.id}): ${error.error}`);
        });
      }

      console.log("\n🎉 Bulk AI SEO update process completed!");
    } catch (error) {
      console.error(
        "💥 Fatal error during bulk update process:",
        error.message
      );
      throw error;
    }
  }
}
