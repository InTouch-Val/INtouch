//@ts-nocheck
import React, {useRef } from "react";
import "../DiaryPage.css";
import { ToolbarProvider } from "../../../../service/ToolbarContext";
import { EditorToolbar } from "../../../../service/editors-toolbar";
import { Controller, useFormContext } from "react-hook-form";
import useMobileWidth from "../../../../utils/hook/useMobileWidth";
import { ClientDiary } from "../../../../store/entities/assignments/types";
import {getBlockConfig} from "../../../../utils/helperFunction/getBlockConfig";
import {useEditorState}from "../../../../utils/hook/useEditorState";
import {
  EditorState
} from "draft-js";

export default function DiaryBlockAnalysisClient({ diary }: { diary: ClientDiary | null }){
  const isMobileWidth = useMobileWidth();
  const { control,setValue,  getValues } = useFormContext();

  const editorRef = useRef<EditorToolbar | null>(null);

  const [editorState, handleEditorStateChange] = useEditorState(diary?.thoughts_analysis || null);
  const block = getBlockConfig(getValues, "thoughts_analysis");


  return (
    <div className="diary__block-event">
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
              setEditorState={(newEditorState: EditorState) => handleEditorStateChange(newEditorState, setValue, "thoughts_analysis")}
              placeholder={"Write your answer here..."}
              block={block}
              isMobileWidth={isMobileWidth}
            />
          </ToolbarProvider>
        )}
      />
    </div>
  );
}
