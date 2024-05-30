import React, { useState, useRef, useEffect } from 'react';
import '../DiaryPage.css';
import { ToolbarProvider } from '../../../../service/ToolbarContext';
import { EditorToolbar } from '../../../../service/editors-toolbar';
import { EditorState, convertFromRaw, convertToRaw, ContentState } from 'draft-js';
import { Controller, useFormContext } from 'react-hook-form';
import useMobileWidth from '../../../../utils/hook/useMobileWidth';

export default function EventDetailsClient({ diary, type }) {
  const isMobileWidth = useMobileWidth();

  const editorRef = useRef(null);

  const { control, setValue, getValues } = useFormContext();

  const [editorState, setEditorState] = useState(() => {
    if (diary && diary.event_details) {
      let content;
      try {
        content = JSON.parse(diary.event_details);
        if (typeof content === 'object') {
          const contentState = convertFromRaw(content);
          return EditorState.createWithContent(contentState);
        }
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        const contentState = ContentState.createFromText(diary.event_details);
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });

  const block = {
    type: 'open',
    question: getValues('event_details'),
    description: 'd',
  };

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    setValue('event_details', JSON.stringify(rawContent));
  };

  return (
    <div className="diary__block-event">
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
              setEditorState={handleEditorStateChange}
              placeholder={'Write your answer here...'}
              block={block}
              isMobileWidth={isMobileWidth}
            />
          </ToolbarProvider>
        )}
      />
    </div>
  );
}
