//@ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import "./styles.css";
import arrowBack from "../../../../images/assignment-page/arrowBack.svg";
import { Link, useNavigate } from "react-router-dom";
import save from "../../../../images/assignment-page/save.svg";
import { useAuth } from "../../../../service/authContext";
import { useFormContext, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import useMobileWidth from "../../../../utils/hook/useMobileWidth";
import { useAppDispatch } from "../../../../store/store";
import { openModalExitUnsaved } from "../../../../store/slices/modals/modalsSlice";
import { ClientDiary } from "../../../../utils/global-types";
import FloatingAlert from "../../../../stories/floating-alert/FloatingAlert";

const options = {
  weekday: "long",
  day: "2-digit",
  month: "short",
  year: "numeric",
};

interface Props {
  diary: ClientDiary | null;
  onSubmit: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  changesMade: boolean;
  isSaved: boolean;
}

export default function DiaryHeaderClient({
  diary,
  onSubmit,
  changesMade,
  isSaved,
}: Props) {
  const isMobileWidth = useMobileWidth();
  const [isHover, setHover] = React.useState(false);

  const dispatch = useAppDispatch();

  const handleOpenExitModal = () => {
    dispatch(openModalExitUnsaved());
  };

  const navigate = useNavigate();

  const handleGoBack = useCallback(() => {
    if (changesMade && !isSaved) {
      handleOpenExitModal();
    }
  }, [changesMade, isSaved, handleOpenExitModal, navigate]);

  const { currentUser } = useAuth();
  const { handleSubmit, control } = useFormContext();

  const {
    setValue,
    formState: { isValid },
    trigger,
    getValues,
  } = useFormContext();

  const form = useWatch({ control });

  return (
    <>
      <div className="diary__header diary__header--complete">
        <div className="diary__title-header">
          <div className="diary__title">Emotion Journal</div>
          <div className="diary__title-date">
            {diary
              ? new Date(diary.add_date).toLocaleDateString("en-US", options)
              : new Date().toLocaleDateString("en-US", options)}
          </div>
        </div>

        <div className="buttons__container">
          <div
            onClick={() => {
              if (changesMade && !isSaved) {
                handleGoBack();
              } else {
                navigate(-1);
              }
            }}
          >
            {isMobileWidth ? (
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ color: "#417D88" }}
                size="xl"
              />
            ) : (
              <img src={arrowBack} alt="back" className="diary__img-back" />
            )}
          </div>

          {!isMobileWidth &&
            (isValid ? (
              <img
                src={save}
                about="save"
                className="diary__img-back"
                onClick={handleSubmit(onSubmit)}
              />
            ) : (
              <img
                src={save}
                about="save"
                className="diary__img-save--unactive"
                onMouseLeave={(e) => setHover(false)}
                onMouseEnter={(e) => setHover(true)}
              />
            ))}
        </div>

        {!isValid && (
          <div className="diary__message-valid--create-diary">
            <FloatingAlert
              label="Please fill in at least one question to save your diary entry"
              visible={isHover ? true : false}
            />
          </div>
        )}
      </div>

      <div className="diary__dear-message">
        <div className="diary__dear-name">Dear {currentUser.first_name},</div>
        <div className="diary__dear-text">
          Capture your emotional experiences and thoughtfully analyze
          situations.
        </div>
      </div>
    </>
  );
}
