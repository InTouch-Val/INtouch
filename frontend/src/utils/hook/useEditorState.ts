import { useState } from "react";
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  ContentState,
  RawDraftContentState,
} from "draft-js";
import { useFormContext } from "react-hook-form";

export const useEditorState = (initialContent: string | null) => {
  const [editorState, setEditorState] = useState(() => {
    if (initialContent) {
      let content: RawDraftContentState;
      try {
        content = JSON.parse(initialContent);
        if (typeof content === "object") {
          const contentState = convertFromRaw(content);
          return EditorState.createWithContent(contentState);
        }
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        const contentState = ContentState.createFromText(initialContent);
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });

  const handleEditorStateChange = (newEditorState: EditorState, setValue: (name: string, value: any) => void, fieldName: string) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    setValue(fieldName, JSON.stringify(rawContent));
  };

  return [editorState, handleEditorStateChange] as const;
};
