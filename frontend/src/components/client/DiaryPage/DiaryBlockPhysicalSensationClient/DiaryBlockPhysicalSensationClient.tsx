//@ts-nocheck
import React, { useRef, useState } from "react";
import "../DiaryPage.css";
import { EditorState, convertFromRaw } from "draft-js";
import { EditorToolbar } from "../../../../service/editors-toolbar";
import { ToolbarProvider } from "../../../../service/ToolbarContext";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import useMobileWidth from "../../../../utils/hook/useMobileWidth";

export default function DiaryBlockPhysicalSensationClient({ diary, type, showInputsincomplete }) {
  const isMobileWidth = useMobileWidth();

  const editorRef = useRef(null);
  const { control, setValue, getValues } = useFormContext();
  const content = {
    blocks: [
      {
        key: "abcde",
        text: diary ? diary.physical_sensations : "",
        type: "open",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  };

  const contentState = convertFromRaw(content);
  const [editorState, setEditorState] = useState(() =>
    type == "exist"
      ? EditorState.createWithContent(contentState)
      : EditorState.createEmpty(),
  );
  const block = {
    type: "open",
    question: "d",
    description: "d",
  };

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const text = contentState.getPlainText();

    setValue("physical_sensations", text);
  };

  const value = getValues("physical_sensations")

  return (
    <div className={!value && showInputsincomplete ? `incomplete diary__block-event` : `diary__block-event`}>
      <div className="diary__block-title">Physical Sensations</div>
      <div className="diary__block-question">
        Describe any physical sensations or changes you noticed in your body.
        For example, tension, butterflies, etc.
      </div>
      <Controller
        name="physical_sensations"
        control={control}
        render={({ field: { ...fieldsProps } }) => (
          <ToolbarProvider>
            <EditorToolbar
              {...fieldsProps}
              ref={editorRef}
              editorState={editorState}
              setEditorState={handleEditorStateChange}
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
