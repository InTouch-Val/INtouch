import { useCallback } from "react";
import { EditorState, Modifier } from "draft-js";

const useHandlePastedText = (
  editorState: EditorState,
  maxLength: number,
  handleEditorStateChange: (newEditorState: EditorState) => void
) => {
  return useCallback(
    (pastedText: string, html: string | undefined) => {
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
          "insert-characters"
        );
        handleEditorStateChange(newEditorState);
        return "handled";
      }

      return "not-handled";
    },
    [editorState, maxLength, handleEditorStateChange]
  );
};

export default useHandlePastedText;
