//@ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  listEmotions,
  listEmotionsChipsMobile,
} from "../../../psy/DiaryPageContent/DiaryBlockEmotion/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import MobileEmotionPageStyles from "./MobileEmotionPage.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "./swiper.css";
import { API } from "../../../../service/axios";

export default function MobileEmotionPage({ type, id, setShowEmotionsPage }) {
  const { control, getValues, setValue } = useFormContext();

  const clarifyingEmotionValues = getValues("clarifying_emotion");
  const primaryEmotionValue = getValues("primary_emotion");

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(clarifyingEmotionValues.length);
  }, [clarifyingEmotionValues]);

  const [offset, setOffset] = useState(0);
  const [currentPrimaryEmotion, setCurrentPrimaryEmotion] = useState(
    listEmotions[0].title,
  );
  const swiperRef = useRef(null);
  const [prevTranslate, setPrevTranslate] = useState(0);

  const initialSlideIndex = listEmotions.findIndex(
    (emotion) => emotion.title === primaryEmotionValue,
  );

  const handleSaveClick = () => {
    setValue("primary_emotion", currentPrimaryEmotion);
    setShowEmotionsPage(false);
  };

  const handleSlideChange = (swiper) => {
    const activeIndex = swiper.activeIndex % listEmotions.length;
    const newPrimaryEmotion = listEmotions[activeIndex].title;
    setCurrentPrimaryEmotion(newPrimaryEmotion);
    setValue("primary_emotion", newPrimaryEmotion);
  };

  const handleClickSecondaryEmotion = (item) => {
    if (clarifyingEmotionValues.includes(item.title)) {
      const newArray = clarifyingEmotionValues.filter(
        (emotion) => emotion !== item.title,
      );
      setValue("clarifying_emotion", newArray);
    } else {
      setValue("clarifying_emotion", [...clarifyingEmotionValues, item.title]);
    }
  };

  const handleTouchMove = (swiper) => {
    if (!swiperRef.current) return;
    const currentTranslate = swiper.getTranslate();
    const deltaTranslate = currentTranslate - prevTranslate;
    const movementFactor = 300;
    const adjustedOffset =
      offset + deltaTranslate * (movementFactor / swiper.width);
    setOffset(adjustedOffset);
    setPrevTranslate(currentTranslate);
  };

  const swiperSettings = {
    effect: "creative",
    grabCursor: true,
    centeredSlides: true,
    creativeEffect: {
      prev: {
        shadow: false,
        translate: ["-180%", 0, -600],
        origin: "left center",
      },
      next: {
        shadow: false,
        translate: ["180%", 0, -600],
        opacity: 1,
        origin: "right center",
      },
    },
    modules: [EffectCreative],

    slidesPerView: 2.5,
    initialSlide: initialSlideIndex,
    onSliderMove: handleTouchMove,
    onSlideChange: handleSlideChange,
  };

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const initialTranslate = swiperRef.current.swiper.getTranslate();
      setOffset(initialTranslate - 100);
    }
  }, [swiperRef]);

  return (
    <div className={MobileEmotionPageStyles.mobile_emotion_page}>
      <span onClick={() => setShowEmotionsPage(false)}>
        <FontAwesomeIcon
          icon={faArrowLeft}
          style={{ color: "#417D88", marginLeft: "28px" }}
          size="xl"
        />
      </span>
      <h1 className={MobileEmotionPageStyles.mobile_emotion_title}>
        Emotion Journal
      </h1>
      <p className={MobileEmotionPageStyles.mobile_emotion_description}>
        How are you feeling? <br />
        Choose from our prompt.
      </p>
      <div className="diary__emotions-wrapper">
        <div className={MobileEmotionPageStyles.mobile_emotion_swiper}>
          <Swiper
            {...swiperSettings}
            className={MobileEmotionPageStyles.swiper}
            ref={swiperRef}
          >
            {listEmotions.map((item) => (
              <SwiperSlide key={item.id}>
                {({ isActive }) => (
                  <div
                    onClick={() => setValue("primary_emotion", item.title)}
                    className={
                      isActive
                        ? MobileEmotionPageStyles.swiper_slide_active
                        : MobileEmotionPageStyles.swiper_slide
                    }
                  >
                    <img src={item.img} alt={item.title} />
                    <div className={MobileEmotionPageStyles.swiper_slide_title}>
                      {item.title}
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div
        className={MobileEmotionPageStyles.mobile_feelings_container}
        style={{
          transform: `translateX(${offset}px)`,
        }}
      >
        <Controller
          name="clarifying_emotion"
          control={control}
          render={() =>
            listEmotionsChipsMobile.map((item, index) => (
              <div
                key={index}
                className={`${clarifyingEmotionValues?.includes(item.title) ? MobileEmotionPageStyles.diary__emotion_chip_active : MobileEmotionPageStyles.diary__emotion_chip}`}
                onClick={() => handleClickSecondaryEmotion(item)}
              >
                {item.title}
              </div>
            ))
          }
        />
      </div>
      <div
        className={MobileEmotionPageStyles.mobile_emotions__save_wrapper}
        onClick={handleSaveClick}
      >
        <button
          type="submit"
          className={MobileEmotionPageStyles.mobile_emotions__save}
          disabled={!isValid}
        >
          Save
        </button>
      </div>
    </div>
  );
}
