//@ts-nocheck
import React, { useRef, useCallback } from "react";
import "../DiaryPage.css";
import { ToolbarProvider } from "../../../../service/ToolbarContext";
import { EditorToolbar } from "../../../../service/editors-toolbar";
import { Controller, useFormContext } from "react-hook-form";
import useMobileWidth from "../../../../utils/hook/useMobileWidth";
import { ClientDiary } from "../../../../utils/global-types";
import { getBlockConfig } from "../../../../utils/helperFunction/getBlockConfig";
import { useEditorState } from "../../../../utils/hook/useEditorState";
import { DIARY_MAX_LENGTH } from "../../../../utils/constants";
import { handleBeforeInput as handleBeforeInputUtil } from "../../../../utils/helperFunction/editorUtils";
import useHandlePastedText from "../../../../utils/hook/useHandlePastedText";

interface Props {
  diary: ClientDiary;
  showInputsincomplete: boolean;
}

export default function DiaryBlockAnalysisClient({
  diary,
  showInputsincomplete,
}: Props) {
  const isMobileWidth = useMobileWidth();
  const editorRef = useRef<EditorToolbar | null>(null);
  const { control, setValue, getValues } = useFormContext();

  const [editorState, handleEditorStateChange] = useEditorState(
    diary?.thoughts_analysis || null,
  );

  const handleBeforeInput = useCallback(
    (chars, editorState) =>
      handleBeforeInputUtil(chars, editorState, DIARY_MAX_LENGTH),
    [],
  );

  const handlePastedText = useHandlePastedText(
    editorState,
    DIARY_MAX_LENGTH,
    (newEditorState) =>
      handleEditorStateChange(newEditorState, setValue, "thoughts_analysis"),
  );

  const block = getBlockConfig(getValues, "thoughts_analysis");

  const value = getValues("thoughts_analysis");
  return (
    <div
      className={
        !value && showInputsincomplete
          ? `incomplete diary__block-event`
          : `diary__block-event`
      }
    >
      <div className="diary__block-title">Thoughts Analysis</div>
      <div className="diary__block-question">
        Reflect on your thoughts related to the situation. What were you
        thinking?
      </div>

      <Controller
        name="thoughts_analysis"
        control={control}
        render={({ field: { ...fieldsProps } }) => (
          <ToolbarProvider>
            <EditorToolbar
              {...fieldsProps}
              key="diary_analysis"
              ref={editorRef}
              editorState={editorState}
              setEditorState={(newEditorState: EditorState) =>
                handleEditorStateChange(
                  newEditorState,
                  setValue,
                  "thoughts_analysis",
                )
              }
              placeholder={"Write your answer here..."}
              block={block}
              isMobileWidth={isMobileWidth}
              handleBeforeInput={handleBeforeInput}
              handlePastedText={handlePastedText}
            />
          </ToolbarProvider>
        )}
      />
    </div>
  );
}
