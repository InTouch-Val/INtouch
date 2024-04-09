import React from 'react';
import './styles.css';
import arrowBack from '../../../../images/assignment-page/arrowBack.svg';
import { Link } from 'react-router-dom';
import save from '../../../../images/assignment-page/save.svg';
import { useAuth } from '../../../../service/authContext';

const options = { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' };

export default function DiaryHeaderClient({ diary }) {
  const { currentUser } = useAuth();
  return (
    <>
      <div className="diary__header">
        <div className="diary__title-header">
          <div className="diary__title">Emotion Journal</div>
          <div className="diary__title-date">
            {new Date(diary.add_date).toLocaleDateString('en-US', options)}
          </div>
        </div>

        <div className="buttons__container">
          <Link to={-1}>
            <img src={arrowBack} alt="back" className="diary__img-back" />
          </Link>
          <img src={save} about="save" className="diary__img-back" />
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
