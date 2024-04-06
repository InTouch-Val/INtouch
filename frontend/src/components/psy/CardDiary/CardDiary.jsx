import React from 'react';
import './CardDiary.css';
import Button from '../button/ButtonHeadline';
import { useNavigate } from 'react-router-dom';

export const options = { weekday: 'short', month: 'long', year: 'numeric' };

export default function CardDiary({ card }) {
  const navigate = useNavigate();

  function goDiary() {
    navigate(`/diary/${card.id}`);
  }

  return (
    <div className="diary__card" onClick={() => goDiary()}>
      <div className="diary__card-title">
        <div className="diary__card-title__day">{new Date(card.add_date).getDay()}</div>
        <div className="diary__card-title__date">
          {new Date(card.add_date).toLocaleDateString('en-US', options)}
        </div>
      </div>
      <div className="diary__card-text">{card.event_details}</div>

      <div className="diary__card-buttons" onClick={(e) => e.stopPropagation()}>
        <Button className="diary__card-button">Okay</Button>
        <Button className="diary__card-button">Enthusiasm</Button>
      </div>
    </div>
  );
}
