//@ts-nocheck
import React, { useEffect } from "react";
import "./styles.css";
import Button from "../../../psy/button/ButtonHeadline";
import { useFormContext, useWatch } from "react-hook-form";
import useMobileWidth from "../../../../utils/hook/useMobileWidth";
import { openModalSaveIncomplete } from "../../../../store/slices/modals/modalsSlice";
import { useAppDispatch } from "../../../../store/store";

import { API } from "../../../../service/axios";
import { ClientDiary } from "../../../../utils/global-types";

interface Props {
  diary: ClientDiary;
  setChangesMade: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInputsincomplete: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DiaryFooterClient({
  diary,
  setChangesMade,
  setShowInputsincomplete,
}: Props) {
  const isMobileWidth = useMobileWidth();

  const {
    setValue,
    formState: { isValid },
    trigger,
    getValues,
  } = useFormContext();

  const [active, setActive] = React.useState(diary ? diary.visible : false);

  const primaryEmotionValue = getValues("primary_emotion");
  const secondEmotionValues = getValues("clarifying_emotion");

  const [isHover, setHover] = React.useState(false);

  const watchAllFields = useWatch();

  const initialFormState = React.useRef(JSON.stringify(getValues()));

  const dispatch = useAppDispatch();
  const handleOpenModalSaveIncomplete = () => {
    dispatch(openModalSaveIncomplete());
  };

  const handleClickVisible = async () => {
    await setActive((prev) => !prev);
    try {
      const response = await API.patch(`/diary-notes/${diary.id}/visible/`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  function hasFormChanged() {
    const currentValues = JSON.stringify(getValues());
    setChangesMade(currentValues !== initialFormState.current);
    return currentValues !== initialFormState.current;
  }

  const handleSaveClick = (e: Event) => {
    if (!allFieldsFilled()) {
      e.stopPropagation();
      e.preventDefault();
      handleSaveIncomplete();
      setShowInputsincomplete(true);
    }
  };

  function handleSaveIncomplete() {
    handleOpenModalSaveIncomplete();
  }

  useEffect(() => {
    trigger();
  }, [watchAllFields, trigger]);

  const allFieldsFilled = () => {
    const values = watchAllFields;
    const keys = Object.keys(values);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === "visible" || keys[i] === "answer_emotion") continue;
      const value = values[keys[i]];
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return false;
      }
    }
    return true;
  };

  React.useEffect(() => {
    setValue("visible", active);
  }, [active]);

  return (
    <div className="diary__footer">
      <div
        className="diary__footer-shared"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="diary__footer-shared-text">Share with my therapist</div>
        <input
          type="checkbox"
          className="footer__input-checkbox"
          defaultChecked={active}
          onClick={handleClickVisible}
        />
      </div>

      <div
        className="diary__footer-button-wrapper"
        onMouseLeave={(e) => setHover(false)}
        onMouseEnter={(e) => setHover(true)}
      >
        <div onClick={handleSaveClick}>
          <Button
            type="submit"
            className="diary__footer-button"
            disabled={!isValid || !hasFormChanged()}
          >
            Save
          </Button>
        </div>

        {(!isValid || !hasFormChanged()) && (
          <span
            className={`diary__message-valid ${!isHover && "diary__message-valid-hidden"}`}
          >
            {isMobileWidth
              ? "Fill in at least one question to save"
              : "Please fill in at least one question to save your diary entry"}
          </span>
        )}
      </div>
    </div>
  );
}
