/*
 * Bulk update stories with AI-generated SEO content using the Management API
 *
 * Usage:
 * npm run ai-seo-bulk-update
 *
 * Environment Variables Required:
 * - SB_MANAGEMENT_API_TOKEN: Your Storyblok Management API token
 * - SB_SPACE_ID: The space ID where stories will be updated
 * - SB_CONTENT_TYPE: The content type component name (e.g., 'blog_post', 'page')
 * - SB_SEO_FIELD_NAME: The name of the AI SEO field in your content type
 * - AI_API_URL: Your AI API endpoint URL
 * - AI_API_TOKEN: Your AI API authentication token
 * - AI_CUSTOM_PROMPT: Custom prompt for AI content generation (optional)
 *
 * Command line arguments:
 * --dry-run: Run in dry mode without making actual changes
 * --space-id: Override space ID from environment
 * --content-type: Override content type from environment
 * --seo-field: Override SEO field name from environment
 *
 * Examples:
 * npm run ai-seo-bulk-update
 * npm run ai-seo-bulk-update -- --dry-run
 * npm run ai-seo-bulk-update -- --space-id=12345 --content-type=blog_post
 */

import { bulkAiSeoUpdate } from "../helpers/index.js";
import dotenv from "dotenv";
dotenv.config();

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

// Helper function to get argument value
function getArgValue(argName) {
  const arg = args.find((a) => a.startsWith(`--${argName}=`));
  return arg ? arg.split("=")[1] : null;
}

// Configuration with environment variables and command line overrides
const config = {
  token: process.env.SB_MANAGEMENT_API_TOKEN,
  space_id: getArgValue("space-id") || process.env.SB_SPACE_ID,
  content_type: getArgValue("content-type") || process.env.SB_CONTENT_TYPE,
  seo_field_name: getArgValue("seo-field") || process.env.SB_SEO_FIELD_NAME,
  ai_api_url: process.env.AI_API_URL,
  ai_api_token: process.env.AI_API_TOKEN,
  custom_prompt:
    process.env.AI_CUSTOM_PROMPT ||
    `You are an SEO expert. Based on the provided story content, generate optimized SEO metadata. Focus on creating compelling, keyword-rich content that will improve search engine visibility and click-through rates.`,
};

// Validation
const requiredFields = ["token", "space_id", "content_type", "seo_field_name"];
const missingFields = requiredFields.filter((field) => !config[field]);

if (missingFields.length > 0) {
  console.error("❌ Missing required configuration:");
  missingFields.forEach((field) => {
    const envVar = `SB_${field.toUpperCase()}`;
    console.error(`- ${envVar}: ${field}`);
  });
  console.error(
    "\nPlease set the required environment variables or use command line arguments."
  );
  console.error("\nExample .env file:");
  console.error("SB_MANAGEMENT_API_TOKEN=your_token_here");
  console.error("SB_SPACE_ID=12345");
  console.error("SB_CONTENT_TYPE=blog_post");
  console.error("SB_SEO_FIELD_NAME=seo_meta");
  console.error("AI_API_URL=https://api.your-ai-provider.com/v1/generate");
  console.error("AI_API_TOKEN=your_ai_token_here");
  console.error('AI_CUSTOM_PROMPT="Your custom prompt here"');
  process.exit(1);
}

// Check AI configuration for non-dry runs
if (!dryRun && (!config.ai_api_url || !config.ai_api_token)) {
  console.error("❌ AI API configuration is required for actual updates:");
  console.error("- AI_API_URL: Your AI API endpoint");
  console.error("- AI_API_TOKEN: Your AI API token");
  console.error("\nUse --dry-run flag to test without AI API calls.");
  process.exit(1);
}

// Display configuration
console.log("🔧 Configuration:");
console.log(`Space ID: ${config.space_id}`);
console.log(`Content Type: ${config.content_type}`);
console.log(`SEO Field Name: ${config.seo_field_name}`);
console.log(
  `AI API URL: ${config.ai_api_url ? "✅ Configured" : "❌ Not configured"}`
);
console.log(
  `AI API Token: ${config.ai_api_token ? "✅ Configured" : "❌ Not configured"}`
);
console.log(`Dry Run: ${dryRun}`);
console.log("");

// Confirmation prompt for non-dry runs
if (!dryRun) {
  console.log(
    "⚠️  WARNING: This will make actual changes to your Storyblok content!"
  );
  console.log(
    "⚠️  Make sure you have a backup of your content before proceeding."
  );
  console.log("");

  // In a real scenario, you might want to add a confirmation prompt here
  // For now, we'll proceed automatically but log the warning
}

try {
  // Create and run the bulk update
  const storyblok = new bulkAiSeoUpdate(config);
  await storyblok.processBulkSeoUpdates(dryRun);
} catch (error) {
  console.error("💥 Script failed:", error.message);
  console.error("\nFull error details:");
  console.error(error);
  process.exit(1);
}
