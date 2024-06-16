//@ts-nocheck

import React from "react";
import "./CardDiary.css";
import Button from "../button/ButtonHeadline";
import { useNavigate } from "react-router-dom";
import { getDate } from "../../../utils/helperFunction/getDate";

export default function CardDiary({ card }) {
  const navigate = useNavigate();

  function goDiary() {
    navigate(`/diary/${card.id}`);
  }

  const date = `${getDate(card).dayOfWeek}\n${getDate(card).monthYear}`;

  return (
    <div className="diary__card" onClick={() => goDiary()}>
      <div className="diary__card-title">
        <div className="diary__card-title__day">
          {new Date(card.add_date).getUTCDate()}
        </div>
        <div className="diary__card-title__date">{date}</div>
      </div>
      <div className="diary__card-text">{card.event_details}</div>

      <div className="diary__card-buttons" onClick={(e) => e.stopPropagation()}>
        {card.primary_emotion != "" && (
          <Button className="diary__card-button">
            {card.primary_emotion
              .toLowerCase()
              .replace(/(^\w)(\w+)/, (a, b, c) => b.toUpperCase() + c)}
          </Button>
        )}
        {card.clarifying_emotion.length > 0 && (
          <Button className="diary__card-button">
            <p className="diary__button-text">{card.clarifying_emotion[0]}</p>
          </Button>
        )}
      </div>
    </div>
  );
}
