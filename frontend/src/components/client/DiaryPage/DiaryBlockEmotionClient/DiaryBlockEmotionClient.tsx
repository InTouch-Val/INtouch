//@ts-nocheck
import React, { useRef, useState, useEffect } from "react";
import "../DiaryPage.css";
import {
  listEmotions,
  listEmotionsChips,
} from "../../../psy/DiaryPageContent/DiaryBlockEmotion/constants";
import { ToolbarProvider } from "../../../../service/ToolbarContext";
import { EditorState } from "draft-js";
import { EditorToolbar } from "../../../../service/editors-toolbar";
import { Controller, useFormContext } from "react-hook-form";
import DiaryBlockEmotionClientMobile from "./DiaryBlockEmotionClientMobile";
import useMobileWidth from "../../../../utils/hook/useMobileWidth";
import { ClientDiary } from "../../../../store/entities/assignments/types";
import { useEditorState } from "../../../../utils/hook/useEditorState";
import { getBlockConfig } from "../../../../utils/helperFunction/getBlockConfig";

interface Props {
  diary: ClientDiary;
  setShowEmotionsPage: React.Dispatch<React.SetStateAction<boolean>>;
  showInputsincomplete: boolean;
}

export default function DiaryBlockEmotionClient({
  diary,
  setShowEmotionsPage,
  showInputsincomplete,
}: Props) {
  const isMobileWidth = useMobileWidth();

  const editorRef = useRef(null);
  const { control, setValue, getValues } = useFormContext();
  const primaryEmotionValue = getValues("primary_emotion");
  const secondEmotionValues = getValues("clarifying_emotion");

  const [editorState, handleEditorStateChange] = useEditorState(
    diary?.emotion_type || null,
  );
  const block = getBlockConfig(getValues, "emotion_type");

  function handleClickSecondEmotion(item) {
    if (secondEmotionValues.includes(item.title)) {
      const newArray = secondEmotionValues.filter(
        (emotion) => emotion !== item.title,
      );
      setValue("clarifying_emotion", newArray);
    } else {
      setValue("clarifying_emotion", [...secondEmotionValues, item.title]);
    }
  }

  const value = getValues("emotion_type");

  return (
    <>
      <div
        className={
          !value && showInputsincomplete
            ? `incomplete diary__block-event`
            : `diary__block-event`
        }
      >
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
                setEditorState={(newEditorState: EditorState) =>
                  handleEditorStateChange(
                    newEditorState,
                    setValue,
                    "emotion_type",
                  )
                }
                placeholder={"Write your answer here..."}
                block={block}
                isMobileWidth={isMobileWidth}
              />
            </ToolbarProvider>
          )}
        />
        {isMobileWidth ? null : (
          <>
            <div className="diary__emotions-wrapper">
              <div className="diary__emotions">
                <Controller
                  name="primary_emotion"
                  control={control}
                  render={({ field: { ...fieldsProps } }) =>
                    listEmotions.map((item) => {
                      return (
                        <div
                          onClick={() =>
                            setValue("primary_emotion", item.title)
                          }
                          key={item.id}
                          className={`${item.title === primaryEmotionValue ? "diary__emotion-container diary__emotion-container-active" : "diary__emotion-container"}`}
                        >
                          <img
                            src={item.img}
                            className="diary__emotion"
                            alt={item.title}
                          />
                          <div className="diary__emotion-title">
                            {item.title}
                          </div>
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
                        className={`${secondEmotionValues.find((emotion) => item.title === emotion) ? "diary__emotion-chip chip_active" : "diary__emotion-chip"}`}
                        onClick={() => handleClickSecondEmotion(item)}
                      >
                        {item.title}
                      </div>
                    );
                  })
                }
              />
            </div>
          </>
        )}
      </div>

      {isMobileWidth ? (
        <DiaryBlockEmotionClientMobile
          primaryEmotionValue={primaryEmotionValue}
          setShowEmotionsPage={setShowEmotionsPage}
        />
      ) : null}

      {isMobileWidth && secondEmotionValues.length > 0 ? (
        <div className="diary__emotions-names-wrapper--mobile">
          <ul className="diary__emotions-names-list--mobile">
            {listEmotionsChips
              .filter((item) => secondEmotionValues.includes(item.title))
              .map((filteredItem, index) => (
                <li key={index}>
                  <div className="diary__emotion-name-container--mobile">
                    <span className="diary__emotion-name--mobile">
                      {filteredItem.title}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
