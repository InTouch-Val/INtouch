import React from 'react';
import Button from '../../psy/button/ButtonHeadline';
import './MyDiary.css';
import addEntry from '../../../images/add_entry.svg';
import { API } from '../../../service/axios';
import CardDiaryClient from './CardDiary/CardDiary';

export default function MyDiary() {
  const [diarys, setDiarys] = React.useState();
  const [isFetching, setFetching] = React.useState(false);

  React.useEffect(() => {
    const response = API.get('diary-notes/')
      .then((res) => {
        if (res.status == 200) {
          setDiarys(res.data);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setFetching(true));
  }, [isFetching]);

  return (
    <div className="diary">
      <div className="diary__header">
        <div className="diary__header-title">My Diary</div>

        <Button className="button__container">
          <img src={addEntry} alt="icon add" className="button__image" />
          <div> Add entry</div>
        </Button>
      </div>

      <div className="diary__section">
        <div className="diary__list">
          {isFetching &&
            diarys.map((card) => {
              return <CardDiaryClient key={card.id} card={card} setFetching={setFetching} />;
            })}
        </div>
      </div>
    </div>
  );
}
