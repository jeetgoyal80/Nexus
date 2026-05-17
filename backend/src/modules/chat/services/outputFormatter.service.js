import { BOT_OUTPUT_FORMAT } from "../../bot/constants/bot.constants.js";

const normalizeBulletPoints = (content) => {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.every((line) => line.startsWith("-") || line.startsWith("*"))) {
    return lines.map((line) => `- ${line.replace(/^[-*]\s*/, "")}`).join("\n");
  }

  return lines.map((line) => `- ${line}`).join("\n");
};

const normalizeJson = (content) => {
  try {
    return JSON.stringify(JSON.parse(content), null, 2);
  } catch {
    return JSON.stringify({ response: content }, null, 2);
  }
};

export const outputFormatterService = {
  format(content, outputFormat) {
    if (outputFormat === BOT_OUTPUT_FORMAT.BULLET_POINTS) {
      return normalizeBulletPoints(content);
    }

    if (outputFormat === BOT_OUTPUT_FORMAT.STRUCTURED_JSON) {
      return normalizeJson(content);
    }

    return content.trim();
  },
};
