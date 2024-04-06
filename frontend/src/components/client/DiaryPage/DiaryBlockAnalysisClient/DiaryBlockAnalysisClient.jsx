import React, { useState, useRef } from 'react';
import '../DiaryPage.css';
import EditorState from 'draft-js/lib/EditorState';
import { ToolbarProvider } from '../../../../service/ToolbarContext';
import { EditorToolbar } from '../../../../service/editors-toolbar';
import { Controller, useFormContext } from 'react-hook-form';

export default function DiaryBlockAnalysisClient({ diary }) {
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const block = {
    type: 'open',
  };

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const text = contentState.getPlainText();
    setValue('thoughts_analysis', text);
  };

  const { control, setValue } = useFormContext();
  return (
    <div className="diary__block-event">
      <div className="diary__block-title">Thoughts Analysis</div>
      <div className="diary__block-question">
        Reflect on your thoughts related to the situation. What were you thinking?
      </div>

      <Controller
        name="thoughts_analysis"
        control={control}
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
