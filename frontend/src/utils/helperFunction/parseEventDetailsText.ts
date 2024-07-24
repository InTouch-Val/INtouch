import { convertFromRaw, ContentState } from "draft-js";

export const parseEventDetailsText = (details: string): string => {
  let content;
  try {
    content = JSON.parse(details);
    if (typeof content === "object") {
      const contentState: ContentState = convertFromRaw(content);
      const text: string = contentState.getPlainText();
      return text.trim() ? text : "Write your answer here...";
    }
  } catch (error) {
    return details.trim() ? details : "Write your answer here...";
  }
  return "";
};
