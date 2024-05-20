//@ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import '../DiaryPage.css';
import { EditorState, convertFromRaw } from 'draft-js';
import { ToolbarProvider } from '../../../../service/ToolbarContext';
import { EditorToolbar } from '../../../../service/editors-toolbar';
import { Controller, useFormContext } from 'react-hook-form';
import useMobileWidth from '../../../../utils/hook/useMobileWidth';

export default function DiaryBlockAnalysisClient({ diary, type }) {
  const isMobileWidth = useMobileWidth();

  const editorRef = useRef(null);
  const content = {
    blocks: [
      {
        key: 'abcde',
        text: diary ? diary.thoughts_analysis : ' ',
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
  const [editorState, setEditorState] = useState(() =>
    type == 'exist' ? EditorState.createWithContent(contentState) : EditorState.createEmpty(),
  );
  const block = {
    type: 'open',
    question: 'd',
    description: 'd',
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
