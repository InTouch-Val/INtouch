import React, { useRef, useState } from 'react';
import '../DiaryPage.css';
import { EditorState, convertFromRaw } from 'draft-js';
import { EditorToolbar } from '../../../../service/editors-toolbar';
import { ToolbarProvider } from '../../../../service/ToolbarContext';
import { Controller, useFormContext } from 'react-hook-form';

export default function DiaryBlockPhysicalSensationClient({ diary }) {
  const editorRef = useRef(null);

  const content = {
    blocks: [
      {
        key: 'abcde',
        text: diary.physical_sensations,
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
    const contentState = newEditorState.getCurrentContent();
    const text = contentState.getPlainText();

    setValue('physical_sensations', text);
  };

  const { control, setValue } = useFormContext();
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
              placeholder={'Write you answer here...'}
              block={block}
            />
          </ToolbarProvider>
        )}
      />
    </div>
  );
}