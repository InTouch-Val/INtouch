import React, { useState, useEffect } from 'react';
import './styles.css';
import arrowBack from '../../../../images/assignment-page/arrowBack.svg';
import { Link } from 'react-router-dom';
import save from '../../../../images/assignment-page/save.svg';
import { useAuth } from '../../../../service/authContext';
import { useFormContext, useWatch } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { minMobWidth, maxMobWidth } from '../../../../utils/constants';

const options = { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' };

export default function DiaryHeaderClient({ diary, onSubmit }) {
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

  const { currentUser } = useAuth();
  const { handleSubmit, control } = useFormContext();
  const [isValid, setValid] = React.useState(false);

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

  console.log(isValid);

  return (
    <>
      <div className="diary__header diary__header--complete">
        <div className="diary__title-header">
          <div className="diary__title">Emotion Journal</div>
          <div className="diary__title-date">
            {diary
              ? new Date(diary.add_date).toLocaleDateString('en-US', options)
              : new Date().toLocaleDateString('en-US', options)}
          </div>
        </div>

        <div className="buttons__container">
          <Link to={-1}>
            {isMobileWidth ? (
              <FontAwesomeIcon icon={faArrowLeft} style={{ color: '#417D88' }} size="xl" />
            ) : (
              <img src={arrowBack} alt="back" className="diary__img-back" />
            )}
          </Link>

          {isValid ? (
            isMobileWidth ? null : (
              <img
                src={save}
                about="save"
                className="diary__img-back"
                onClick={handleSubmit(onSubmit)}
              />
            )
          ) : (
            <img src={save} about="save" className="diary__img-back-unactive" />
          )}
        </div>
      </div>

      <div className="diary__dear-message">
        <div className="diary__dear-name">Dear {currentUser.first_name},</div>
        <div className="diary__dear-text">
          Capture your emotional experiences and thoughtfully analyze situations.
        </div>
      </div>
    </>
  );
}
