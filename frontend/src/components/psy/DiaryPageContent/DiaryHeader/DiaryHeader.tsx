//@ts-nocheck
import React from 'react';
import './styles.css';
import arrowBack from '../../../../images/assignment-page/arrowBack.svg';
import { Link } from 'react-router-dom';

const options = { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' };

export default function DiaryHeader({ diary }) {
  return (
    <div className="diary__header">
      <div className="diary__title-header">
        <div className="diary__title">Emotion Journal</div>
        <div className="diary__title-date">
          {new Date(diary.add_date).toLocaleDateString('en-US', options)}
        </div>
      </div>

      <Link to={-1}>
        <img src={arrowBack} alt="back" className="diary__img-back" />
      </Link>
    </div>
  );
}
