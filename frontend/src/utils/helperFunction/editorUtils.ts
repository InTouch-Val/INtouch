import { EditorState } from "draft-js";

// Disables further typing if max length is reached
export const handleBeforeInput = (
  chars: string,
  editorState: EditorState,
  maxLength: number,
) => {
  const currentContent = editorState.getCurrentContent();
  const currentText = currentContent.getPlainText();

  if (currentText.length >= maxLength) {
    return "handled";
  }
  return "not-handled";
};
