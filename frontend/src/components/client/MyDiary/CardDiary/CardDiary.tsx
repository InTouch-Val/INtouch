import React from 'react';
import ellipse from '../../../../images/icons/ellipse.svg';
import './CardDiary.css';
import Button from '../../../psy/button/ButtonHeadline';
import { useNavigate, useParams } from 'react-router-dom';
import { API } from '../../../../service/axios';

export default function CardDiaryClient({ card }) {
  const params = useParams()
  const navigate = useNavigate();
  const options = { weekday: 'short', month: 'long', year: 'numeric' };
  function goDiary() {
    navigate(`/diary/${card.id}`);
  }

  const [active, setActive] = React.useState(card.visible);
  
  const handleClickDelete = async () => {
    const newItem = [...card];
    console.log(newItem);
    // try {
    //   const response = await API.patch(`/diary-notes/${params.id}/`, );
    //   return response.data;
    // } catch (error) {
    //   console.log(error);
    // }
  }

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
        <div className="button__trash" />
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
          onClick={handleClickDelete}
        >
          <img src={ellipse} alt="toggle" className="icon__toogle" />
        </div>
      </div>
    </div>
  );
}
