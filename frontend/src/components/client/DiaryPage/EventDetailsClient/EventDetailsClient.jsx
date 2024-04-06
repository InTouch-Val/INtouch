import React, { useState, useRef } from 'react';
import '../DiaryPage.css';
import { ToolbarProvider } from '../../../../service/ToolbarContext';
import { EditorToolbar } from '../../../../service/editors-toolbar';
import { EditorState } from 'draft-js';
import { Controller, useFormContext } from 'react-hook-form';

export default function EventDetailsClient({ diary }) {
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const block = {
    type: 'open',
  };

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const text = contentState.getPlainText();
    console.log(text);
    setValue('event_details', text);
  };

  const { control, setValue } = useFormContext();

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
              ref={editorRef}
              editorState={editorState}
              setEditorState={handleEditorStateChange}
              placeholder={'Write you answer here...'}
              block={block}
            />
          </ToolbarProvider>
        )}
      />
    </div>
  );
}
