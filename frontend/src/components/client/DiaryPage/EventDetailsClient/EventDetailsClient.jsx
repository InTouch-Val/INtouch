import React, { useState, useRef } from 'react';
import '../DiaryPage.css';
import { ToolbarProvider } from '../../../../service/ToolbarContext';
import { EditorToolbar } from '../../../../service/editors-toolbar';
import { EditorState, convertFromRaw } from 'draft-js';
import { Controller, useFormContext } from 'react-hook-form';

export default function EventDetailsClient({ diary }) {
  const editorRef = useRef(null);
  const content = {
    blocks: [
      {
        key: 'abcde',
        text: diary.event_details,
        type: 'open',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  };

  const contentState = convertFromRaw(content);
  const [editorState, setEditorState] = useState(() => EditorState.createWithContent(contentState));

  const block = {
    type: 'open',
  };

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent('sasass');
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
              value={diary.event_details}
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