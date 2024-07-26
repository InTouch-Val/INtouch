import { convertFromRaw, ContentState } from "draft-js";

const DEFAULT_MESSAGE = "Write your answer here...";

export const parseEventDetailsText = (details: string): string => {
    if (typeof details !== 'string') {
      console.warn('Expected a string for details');
      return DEFAULT_MESSAGE;
    }
  
    try {
      const content = JSON.parse(details);
  
      if (typeof content === "object" && content !== null) {
        const contentState: ContentState = convertFromRaw(content);
        const text: string = contentState.getPlainText();
        return text.trim() ? text : DEFAULT_MESSAGE;
      }
    } catch (error) {
      console.error('Error parsing details:', error);
    }
  
    return details.trim() ? details : DEFAULT_MESSAGE;
  };