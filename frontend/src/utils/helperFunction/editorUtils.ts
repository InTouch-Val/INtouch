import { EditorState, Modifier } from "draft-js";

// Disables further typing if max length is reached
export const handleBeforeInput = (chars: string, editorState: EditorState, maxLength: number) => {
  const currentContent = editorState.getCurrentContent();
  const currentText = currentContent.getPlainText();

  if (currentText.length >= maxLength) {
    return "handled";
  }
  return "not-handled";
};

// Crops pasted string if longer than max length
export const handlePastedText = (
  pastedText: string,
  html: string | undefined,
  editorState: EditorState,
  maxLength: number,
  handleEditorStateChange: (newEditorState: EditorState) => void
) => {
  const currentContent = editorState.getCurrentContent();
  const currentText = currentContent.getPlainText();

  if (currentText.length + pastedText.length > maxLength) {
    const maxLengthAllowed = maxLength - currentText.length;
    const truncatedText = pastedText.slice(0, maxLengthAllowed);

    const contentStateWithPastedText = Modifier.insertText(
      currentContent,
      editorState.getSelection(),
      truncatedText
    );

    const newEditorState = EditorState.push(
      editorState,
      contentStateWithPastedText,
      'insert-characters'
    );
    handleEditorStateChange(newEditorState);
    return 'handled';
  }

  return 'not-handled';
};