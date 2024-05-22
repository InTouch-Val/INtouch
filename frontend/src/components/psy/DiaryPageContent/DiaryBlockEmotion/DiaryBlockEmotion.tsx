//@ts-nocheck

import React from "react";
import "../DiaryPageContent.css";
import { listEmotions, listEmotionsChips } from "./constants";

export default function DiaryBlockEmotion({ diary }) {
  return (
    <div className="diary__block-event">
      <div className="diary__block-title">Emotion Type</div>
      <div className="diary__block-question">
        How are you feeling? Describe your emotions or choose from our prompt.
      </div>
      <div className="diary__block-text">
        Lorem Ipsum dolor sit amet. Lorem Ipsum dolor sit amet. Lorem Ipsum
        dolor sit amet. Lorem Ipsum dolor sit amet.
      </div>
      <div className="diary__emotions-wrapper">
        <div className="diary__emotions">
          {listEmotions.map((item) => {
            return (
              <div
                key={item.id}
                className={`diary__emotion-container ${item.title == diary.primary_emotion && "diary__emotion-container-active"}`}
              >
                <img
                  src={item.img}
                  className="diary__emotion"
                  alt={item.title}
                />
                <div className="diary__emotion-title">{item.title}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="diary__emotions-all">
        {listEmotionsChips.map((item, index) => {
          return (
            <div
              key={index}
              className={`diary__emotion-chip ${diary.clarifying_emotion.find((emotion) => item.title == emotion) && "chip_active"}`}
            >
              {item.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}
