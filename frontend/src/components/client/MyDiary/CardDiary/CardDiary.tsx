import React from 'react';
import ellipse from '../../../../images/icons/ellipse.svg';
import './CardDiary.css';
import Button from '../../../psy/button/ButtonHeadline';
import { useNavigate } from 'react-router-dom';
import { API } from '../../../../service/axios';

export default function CardDiaryClient({ card, setFetching }) {
  const navigate = useNavigate();
  const options = { weekday: 'short', month: 'long', year: 'numeric' };
  function goDiary() {
    navigate(`/diary/${card.id}`);
  }

  const [active, setActive] = React.useState(card.visible);

  const handleClickVisible = async () => {
    setActive((prev) => !prev);

    const newCard = { ...card, visible: active };
    try {
      const response = await API.patch(`/diary-notes/${card.id}/`, newCard);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickDelete = async (event) => {
    event.stopPropagation();
    setFetching(false);
    try {
      const response = await API.delete(`/diary-notes/${card.id}/`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="diary__card" onClick={() => goDiary()}>
      <div className="diary__card-header">
        <div className="diary__card-title">
          <div className="diary__card-title__day">{new Date(card.add_date).getDay()}</div>
          <div className="diary__card-title__date">
            {new Date(card.add_date)
              .toLocaleDateString('en-US', { weekday: 'long', month: 'short', year: 'numeric' })
              .replace(/,/g, '')}
          </div>
        </div>
        <div className="button__trash" onClick={handleClickDelete} />
      </div>
      <div className="diary__card-text">{card.event_details}</div>

      <div className="diary__card-buttons" onClick={(e) => e.stopPropagation()}>
        {card.clarifying_emotion.slice(0, 2).map((item, index) => {
          return (
            <Button key={index} className="diary__card-button">
              {item}
            </Button>
          );
        })}
      </div>
      <div className="diary__card-shared" onClick={(e) => e.stopPropagation()}>
        <div className="diary__card-shared-text">Share with my therapist</div>
        <div
          className={`diary__card-shared-toggle ${active ? 'active' : 'unactive'}`}
          onClick={handleClickVisible}
        >
          <img src={ellipse} alt="toggle" className="icon__toogle" />
        </div>
      </div>
    </div>
  );
}
