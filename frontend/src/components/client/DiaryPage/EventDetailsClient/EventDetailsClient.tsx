//@ts-nocheck
import React, { useState, useRef, useEffect, useCallback } from "react";
import "../DiaryPage.css";
import { ToolbarProvider } from "../../../../service/ToolbarContext";
import { EditorToolbar } from "../../../../service/editors-toolbar";
import { Controller, useFormContext } from "react-hook-form";
import useMobileWidth from "../../../../utils/hook/useMobileWidth";
import { ClientDiary } from "../../../../utils/global-types";
import { useEditorState } from "../../../../utils/hook/useEditorState";
import { getBlockConfig } from "../../../../utils/helperFunction/getBlockConfig";
import { DIARY_MAX_LENGTH } from "../../../../utils/constants";
import { handleBeforeInput as handleBeforeInputUtil} from "../../../../utils/helperFunction/editorUtils";
import useHandlePastedText from "../../../../utils/hook/useHandlePastedText";

interface Props {
  diary: ClientDiary;
  showInputsincomplete: boolean;
}

export default function EventDetailsClient({
  diary,
  type,
  showInputsincomplete,
}: Props) {
  const isMobileWidth = useMobileWidth();

  const editorRef = useRef<EditorToolbar | null>(null);

  const { control, setValue, getValues } = useFormContext();
  const [editorState, handleEditorStateChange] = useEditorState(
    diary?.event_details || null,
  );
  const block = getBlockConfig(getValues, "event_details");

  const value = getValues("event_details");

  const handleBeforeInput = useCallback(
    (chars, editorState) => handleBeforeInputUtil(chars, editorState, DIARY_MAX_LENGTH),
    []
  );


  const handlePastedText = useHandlePastedText(
    editorState,
    DIARY_MAX_LENGTH,
    (newEditorState) => handleEditorStateChange(newEditorState, setValue, "event_details")
  );

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
              handleBeforeInput={handleBeforeInput}
              handlePastedText={handlePastedText}
            />
          </ToolbarProvider>
        )}
      />
    </div>
  );
}
