//@ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import "../DiaryPage.css";
import { ToolbarProvider } from "../../../../service/ToolbarContext";
import { EditorToolbar } from "../../../../service/editors-toolbar";
import { EditorState } from "draft-js";
import { Controller, useFormContext } from "react-hook-form";
import useMobileWidth from "../../../../utils/hook/useMobileWidth";
import { ClientDiary } from "../../../../store/entities/assignments/types";
import { useEditorState } from "../../../../utils/hook/useEditorState";
import { getBlockConfig } from "../../../../utils/helperFunction/getBlockConfig";

export default function EventDetailsClient({
  diary,
  type,
  showInputsincomplete,
}) {
  const isMobileWidth = useMobileWidth();

  const editorRef = useRef<EditorToolbar | null>(null);

  const { control, setValue, getValues } = useFormContext();
  const [editorState, handleEditorStateChange] = useEditorState(
    diary?.event_details || null,
  );
  const block = getBlockConfig(getValues, "event_details");

  const value = getValues("event_details");

  return (
    <div
      className={
        !value && showInputsincomplete
          ? `incomplete diary__block-event`
          : `diary__block-event`
      }
    >
      <div className="diary__block-title">Event Details</div>
      <div className="diary__block-question">
        Describe the event or situation that evoked emotions. What happened?
      </div>
      <Controller
        control={control}
        name="event_details"
        render={({ field: { ...fieldsProps } }) => (
          <ToolbarProvider>
            <EditorToolbar
              {...fieldsProps}
              key="diary_event"
              ref={editorRef}
              editorState={editorState}
              setEditorState={(newEditorState: EditorState) =>
                handleEditorStateChange(
                  newEditorState,
                  setValue,
                  "event_details",
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
