/*
 * Add or read space-level settings for your App or Tool plugin
 */
import { appSpaceSettings } from "../helpers/index.js";
import dotenv from "dotenv";
dotenv.config();

const storyblok = new appSpaceSettings({
  token: process.env.SB_MANAGEMENT_API_TOKEN,
  space_id: process.env.SB_SPACE_ID,
  app_id: process.env.SB_APP_ID,
});

// const settings = await storyblok.addAppSpaceSettings();
const settings = await storyblok.getAppSpaceSettings();
console.log(settings);
