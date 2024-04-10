import React, { useRef, useState } from 'react';
import '../DiaryPage.css';
import {
  listEmotions,
  listEmotionsChips,
} from '../../../psy/DiaryPageContent/DiaryBlockEmotion/constants';
import { ToolbarProvider } from '../../../../service/ToolbarContext';
import { EditorState, convertFromRaw } from 'draft-js';
import { EditorToolbar } from '../../../../service/editors-toolbar';
import { Controller, useFormContext } from 'react-hook-form';

export default function DiaryBlockEmotionClient({ diary }) {
  const editorRef = useRef(null);
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
  const [editorState, setEditorState] = useState(() => EditorState.createWithContent(contentState));
  const block = {
    type: 'open',
  };

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const text = contentState.getPlainText();
    setValue('answer_emotion', text);
  };

  const { control, setValue, watch, getValues } = useFormContext();

  const primaryEmotionActive = watch('primary_emotion');
  const secondEmotionActive = watch('clarifying_emotion');
  const secondEmotionValues = getValues('clarifying_emotion');

  function handleClickSecondEmotion(item) {
    if (secondEmotionValues.includes(item.title)) {
      const newArray = secondEmotionValues.filter((emotion) => emotion !== item.title);
      console.log(newArray);
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
      <div className="diary__block-text">
        Lorem Ipsum dolor sit amet. Lorem Ipsum dolor sit amet. Lorem Ipsum dolor sit amet. Lorem
        Ipsum dolor sit amet.
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
                    className={`diary__emotion-container ${item.title == primaryEmotionActive && 'diary__emotion-container-active'}`}
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
                  className={`diary__emotion-chip ${secondEmotionActive.find((emotion) => item.title == emotion) && 'chip_active'}`}
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
