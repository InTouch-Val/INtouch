import React, { useRef, useState } from 'react';
import '../DiaryPage.css';
import {
  listEmotions,
  listEmotionsChips,
} from '../../../psy/DiaryPageContent/DiaryBlockEmotion/constants';
import { ToolbarProvider } from '../../../../service/ToolbarContext';
import { EditorState, convertFromRaw } from 'draft-js';
import { EditorToolbar } from '../../../../service/editors-toolbar';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

export default function DiaryBlockEmotionClient({ diary, type }) {
  const editorRef = useRef(null);
  const { control, setValue, watch, getValues } = useFormContext();
  const primaryEmotionActive = useWatch({ control, name: 'primary_emotion' });
  const primaryEmotionValue = getValues('primary_emotion');
  const secondEmotionActive = watch('clarifying_emotion');
  const secondEmotionValues = getValues('clarifying_emotion');
  const content = {
    blocks: [
      {
        key: 'abcde',
        text: diary ? diary.emotion_type : ' ',
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
    setValue('emotion_type', text);
  };

  function handleClickSecondEmotion(item) {
    if (secondEmotionValues.includes(item.title)) {
      const newArray = secondEmotionValues.filter((emotion) => emotion !== item.title);
      setValue('clarifying_emotion', newArray);
    } else {
      setValue('clarifying_emotion', [...secondEmotionValues, item.title]);
    }
  }

  return (
    <div className="diary__block-event">
      <div className="diary__block-title">Emotion Type</div>
      <div className="diary__block-question">
        How are you feeling? Describe your emotions or choose from our prompt.
      </div>
      <Controller
        name="answer_emotion"
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
      <div className="diary__emotions-wrapper">
        <div className="diary__emotions">
          <Controller
            name="primary_emotion"
            control={control}
            render={({ field: { ...fieldsProps } }) =>
              listEmotions.map((item) => {
                return (
                  <div
                    onClick={() => setValue('primary_emotion', item.title)}
                    key={item.id}
                    className={`${item.title === primaryEmotionValue ? 'diary__emotion-container diary__emotion-container-active' : 'diary__emotion-container'}`}
                  >
                    <img src={item.img} className="diary__emotion" alt={item.title} />
                    <div className="diary__emotion-title">{item.title}</div>
                  </div>
                );
              })
            }
          />
        </div>
      </div>
      <div className="diary__emotions-all">
        <Controller
          name="clarifying_emotion"
          control={control}
          render={({ field: { ...fieldsProps } }) =>
            listEmotionsChips.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${secondEmotionValues.find((emotion) => item.title === emotion) ? 'diary__emotion-chip chip_active' : 'diary__emotion-chip'}`}
                  onClick={() => handleClickSecondEmotion(item)}
                >
                  {item.title}
                </div>
              );
            })
          }
        />
      </div>
    </div>
  );
}
