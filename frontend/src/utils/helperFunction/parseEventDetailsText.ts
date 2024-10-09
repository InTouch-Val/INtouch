import { convertFromRaw, ContentState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

const DEFAULT_MESSAGE = "";

export const parseEventDetailsText = (details: string): string => {
  if (typeof details !== "string") {
    console.warn("Expected a string for details");
    return DEFAULT_MESSAGE;
  }

  try {
    const content = JSON.parse(details);

    if (typeof content === "object" && content !== null) {
      const contentState: ContentState = convertFromRaw(content);
      const html: string = stateToHTML(contentState);
      return html.trim() ? html : DEFAULT_MESSAGE;
    }
  } catch (error) {
    console.error("Error parsing details:", error);
  }

  return details.trim() ? details : DEFAULT_MESSAGE;
};
