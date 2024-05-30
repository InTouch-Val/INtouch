import React, { useState, useRef } from 'react';
import '../DiaryPage.css';
import { EditorState, convertFromRaw, convertToRaw, ContentState } from 'draft-js';
import { ToolbarProvider } from '../../../../service/ToolbarContext';
import { EditorToolbar } from '../../../../service/editors-toolbar';
import { Controller, useFormContext } from 'react-hook-form';
import useMobileWidth from '../../../../utils/hook/useMobileWidth';

export default function DiaryBlockAnalysisClient({ diary, type }) {
  const isMobileWidth = useMobileWidth();
  const { control, setValue, getValues } = useFormContext();

  const editorRef = useRef(null);

  const [editorState, setEditorState] = useState(() => {
    if (diary && diary.thoughts_analysis) {
      let content;
      try {
        content = JSON.parse(diary.thoughts_analysis);
        if (typeof content === 'object') {
          const contentState = convertFromRaw(content);
          return EditorState.createWithContent(contentState);
        }
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        const contentState = ContentState.createFromText(diary.thoughts_analysis);
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });

  const block = {
    type: 'open',
    question: getValues('thoughts_analysis'),
    description: 'd',
  };

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    setValue('thoughts_analysis', JSON.stringify(rawContent));
  };

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
              key="diary_analysis"
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
