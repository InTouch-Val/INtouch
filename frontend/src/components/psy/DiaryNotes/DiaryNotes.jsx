import React from 'react';
import { useAuth } from '../../../service/authContext';
import './DiaryNotes.css';
import CardDiary from '../CardDiary/CardDiary';
import axios from 'axios';
import { API } from '../../../service/axios';

export default function DiaryNotes({ clientId }) {
  const { currentUser } = useAuth();
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
  }, []);

  return (
    <section className="diarySection">
      <div className="diary__list">
        {isFetching &&
          diarys.map((card) => {
            return <CardDiary key={card.id} card={card} />;
          })}
      </div>
    </section>
  );
}
