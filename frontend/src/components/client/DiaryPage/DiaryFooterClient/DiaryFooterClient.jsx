import React, { useState, useEffect } from 'react';
import './styles.css';
import Button from '../../../psy/button/ButtonHeadline';
import { useFormContext, useWatch } from 'react-hook-form';
import useMobileWidth from '../../../../utils/hook/useMobileWidth';

export default function DiaryFooterClient({ diary }) {
  const isMobileWidth = useMobileWidth();

  const [active, setActive] = React.useState(diary ? diary.visible : false);
  const { control, setValue, getValues, watch } = useFormContext();

  const primaryEmotionValue = getValues('primary_emotion');
  const secondEmotionValues = getValues('clarifying_emotion');

  console.log(primaryEmotionValue);

  const [isValid, setValid] = React.useState(false);
  const [isHover, setHover] = React.useState(false);
  const form = useWatch({ control });

  React.useEffect(() => {
    if (
      form.emotion_type != '' ||
      form.event_details != '' ||
      form.thoughts_analysis != '' ||
      form.physical_sensations != ''
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [form]);
  React.useEffect(() => {
    setValue('visible', active);
  }, [active]);
  return (
    <div className="diary__footer">
      <div className="diary__footer-shared" onClick={(e) => e.stopPropagation()}>
        <div className="diary__footer-shared-text">Share with my therapist</div>
        <input
          type="checkbox"
          className="footer__input-checkbox"
          defaultChecked={active}
          onClick={() => setActive((prev) => !prev)}
        />
      </div>

      <div
        className="diary__footer-button-wrapper"
        onMouseLeave={(e) => setHover(false)}
        onMouseEnter={(e) => setHover(true)}
      >
        <Button type="submit" className="diary__footer-button" disabled={!isValid}>
          Save
        </Button>

        {!isValid && (
          <span className={`diary__message-valid ${!isHover && 'diary__message-valid-hidden'}`}>
            {isMobileWidth
              ? 'Fill in at least one question to save'
              : 'Please fill in at least one question to save your diary entry'}
          </span>
        )}
      </div>
    </div>
  );
}
