import React from 'react';
import { useAuth } from '../../../service/authContext';
import './DiaryNotes.css';
import CardDiary from '../CardDiary/CardDiary';
import axios from 'axios';
import { API } from '../../../service/axios';
import { useObserve } from '../../../utils/hook/useObserve';

export default function DiaryNotes({ clientId }) {
  const { currentUser } = useAuth();
  const [diarys, setDiarys] = React.useState();
  const [isFetching, setFetching] = React.useState(false);

  const [limit, setLimit] = React.useState(0);

  const [isTotal, setTotal] = React.useState(false);
  const observeElement = React.useRef(null);

  const handleTakeUpdate = React.useCallback(() => {
    setLimit((prev) => prev + 20);
  }, []);

  useObserve(observeElement, isTotal, handleTakeUpdate);

  React.useEffect(() => {
    const response = API.get(`diary-notes/?limit=${limit}`)
      .then((res) => {
        let data = res.data.results.filter((diary) => diary.author === clientId);
        if (res.status == 200) {
          setDiarys(data);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setFetching(true));
  }, [limit]);

  return (
    <section className="diarySection">
      <div className="diary__list">
        {isFetching &&
          diarys
            .sort((a, b) => new Date(b.add_date) - new Date(a.add_date))
            .map((card) => {
              if (card.visible) return <CardDiary key={card.id} card={card} />;
            })}
      </div>
      <div ref={observeElement} />
    </section>
  );
}
