//@ts-nocheck
import React, { useRef } from "react";
import "../DiaryPage.css";
import { EditorState } from "draft-js";
import { EditorToolbar } from "../../../../service/editors-toolbar";
import { ToolbarProvider } from "../../../../service/ToolbarContext";
import { Controller, useFormContext } from "react-hook-form";
import useMobileWidth from "../../../../utils/hook/useMobileWidth";
import { ClientDiary } from "../../../../store/entities/assignments/types";
import { useEditorState } from "../../../../utils/hook/useEditorState";
import { getBlockConfig } from "../../../../utils/helperFunction/getBlockConfig";

export default function DiaryBlockPhysicalSensationClient({
  diary,
}: {
  diary: ClientDiary | null;
}) {
  const isMobileWidth = useMobileWidth();

  const editorRef = useRef(null);
  const { control, setValue, getValues } = useFormContext();

  const [editorState, handleEditorStateChange] = useEditorState(
    diary?.physical_sensations || null,
  );
  const block = getBlockConfig(getValues, "physical_sensations");

  return (
    <div className="diary__block-event">
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
              setEditorState={(newEditorState: EditorState) =>
                handleEditorStateChange(
                  newEditorState,
                  setValue,
                  "physical_sensations",
                )
              }
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
