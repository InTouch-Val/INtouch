import React, { useRef, useState, useEffect } from 'react';
import '../DiaryPage.css';
import { EditorState, convertFromRaw } from 'draft-js';
import { EditorToolbar } from '../../../../service/editors-toolbar';
import { ToolbarProvider } from '../../../../service/ToolbarContext';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { minMobWidth, maxMobWidth } from '../../../../utils/constants';

export default function DiaryBlockPhysicalSensationClient({ diary, type }) {
  const [isMobileWidth, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= minMobWidth && width <= maxMobWidth) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Sets the initial state based on the current window size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const editorRef = useRef(null);
  const { control, setValue } = useFormContext();
  const content = {
    blocks: [
      {
        key: 'abcde',
        text: diary ? diary.physical_sensations : '',
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

    setValue('physical_sensations', text);
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
