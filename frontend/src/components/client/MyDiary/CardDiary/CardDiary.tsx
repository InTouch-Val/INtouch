import React from 'react';
import './CardDiary.css';
import Button from '../../../psy/button/ButtonHeadline';
import { useNavigate } from 'react-router-dom';
import { API } from '../../../../service/axios';
import { getDate } from '../../../../utils/helperFunction/getDate';

export default function CardDiaryClient({ card, setFetching, openModal }) {
  const navigate = useNavigate();
  function goDiary() {
    navigate(`/diary/${card.id}`);
  }

  const [active, setActive] = React.useState(card.visible);

  const handleClickVisible = async () => {
    setActive((prev) => !prev);

    const newCard = { ...card, visible: !card.visible };
    try {
      const response = await API.patch(`/diary-notes/${card.id}/`, newCard);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="diary__card" onClick={() => goDiary()}>
      <div className="diary__card-header">
        <div className="diary__card-title-client">
          <div className="diary__card-title__day">{new Date(card.add_date).getUTCDate()}</div>
          <div className="diary__card-title__date">{getDate(card)}</div>
        </div>
        <div
          className="button__trash"
          onClick={(e) => {
            openModal(e, card);
          }}
        />
      </div>
      <div className="diary__card-text">{card.event_details}</div>

      <div className="diary__card-buttons" onClick={(e) => e.stopPropagation()}>
        {card.primary_emotion != '' && (
          <Button className="diary__card-button">
            {card.primary_emotion
              .toLowerCase()
              .replace(/(^\w)(\w+)/, (a, b, c) => b.toUpperCase() + c)}
          </Button>
        )}
        {card.clarifying_emotion.length > 0 && (
          <Button className="diary__card-button">{card.clarifying_emotion[0]}</Button>
        )}
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <label className="card__input-label">
          Share with my therapist
          <input
            type="checkbox"
            className="card__input-checkbox"
            defaultChecked={active}
            onClick={handleClickVisible}
          />
        </label>
      </div>
    </div>
  );
}
