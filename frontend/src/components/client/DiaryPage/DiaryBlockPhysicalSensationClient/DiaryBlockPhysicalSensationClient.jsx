import React, { useRef, useState, useEffect } from 'react';
import '../DiaryPage.css';
import { EditorState, convertFromRaw, convertToRaw, ContentState } from 'draft-js';
import { EditorToolbar } from '../../../../service/editors-toolbar';
import { ToolbarProvider } from '../../../../service/ToolbarContext';
import { Controller, useFormContext } from 'react-hook-form';
import useMobileWidth from '../../../../utils/hook/useMobileWidth';

export default function DiaryBlockPhysicalSensationClient({ diary, type }) {
  const isMobileWidth = useMobileWidth();

  const editorRef = useRef(null);
  const { control, setValue, getValues } = useFormContext();

  const block = {
    type: 'open',
    question: getValues('physical_sensations'),
    description: 'd',
  };

  const [editorState, setEditorState] = useState(() => {
    if (diary && diary.physical_sensations) {
      let content;
      try {
        content = JSON.parse(diary.physical_sensations);
        if (typeof content === 'object') {
          const contentState = convertFromRaw(content);
          return EditorState.createWithContent(contentState);
        }
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        const contentState = ContentState.createFromText(diary.physical_sensations);
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    setValue('physical_sensations', JSON.stringify(rawContent));
  };

  return (
    <div className="diary__block-event">
      <div className="diary__block-title">Physical Sensations</div>
      <div className="diary__block-question">
        Describe any physical sensations or changes you noticed in your body. For example, tension,
        butterflies, etc.
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
