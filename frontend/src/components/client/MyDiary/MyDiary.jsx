import React from 'react';
import Button from '../../psy/button/ButtonHeadline';
import './MyDiary.css';
import addEntry from '../../../images/add_entry.svg';
import { API } from '../../../service/axios';
import CardDiaryClient from './CardDiary/CardDiary';
import { useNavigate } from 'react-router-dom';
import { useObserve } from '../../../utils/hook/useObserve';
import { useAuth } from '../../../service/authContext';

export default function MyDiary() {
  const [diarys, setDiarys] = React.useState([]);
  const [isFetching, setFetching] = React.useState(false);
  const [isShowModal, setShowModal] = React.useState(false);
  const [idCardDelete, setIdCardDelete] = React.useState(false);
  const [limit, setLimit] = React.useState(20);
  const { currentUser } = useAuth();
  const [isTotal, setTotal] = React.useState(false);
  const observeElement = React.useRef(null);

  const navigate = useNavigate();

  const handleTakeUpdate = React.useCallback(() => {
    setLimit((prev) => prev + 20);
  }, []);

  useObserve(observeElement, isTotal, handleTakeUpdate);

  React.useEffect(() => {
    const response = API.get(`diary-notes/?limit=${limit}&offset=0&author=${currentUser.id}`)
      .then((res) => {
        if (res.status == 200) {
          if (res.data.count === diarys.length) {
            setTotal(true);
          } else if (res.data.results.length > 0) {
            setDiarys(res.data.results);
            setTotal(false);
          }

          console.log(diarys);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setFetching(true));
  }, [isFetching, limit]);

  const handleClickDelete = async (event) => {
    event.stopPropagation();
    setFetching(false);
    try {
      const response = await API.delete(`/diary-notes/${idCardDelete}/`);
      closeModal();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  function openModal(e, card) {
    e.stopPropagation();
    setShowModal(true);
    setIdCardDelete(card.id);
  }

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="diary">
        <div className="diary__header">
          <div className="diary__header-title">My Diary</div>

          <Button className="button__container" onClick={() => navigate('/my-diary/create')}>
            <img src={addEntry} alt="icon add" className="button__image" />
            <div> Add entry</div>
          </Button>
        </div>

        <div className="diary__section">
          <div className="diary__list">
            {isFetching &&
              Array.from(diarys)
                .sort((a, b) => new Date(b.add_date) - new Date(a.add_date))
                .map((card) => {
                  return (
                    <CardDiaryClient
                      key={card.id}
                      card={card}
                      setFetching={setFetching}
                      openModal={openModal}
                    />
                  );
                })}
          </div>
          <div className="diary__observe-element" ref={observeElement} />
        </div>
      </div>

      {isShowModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="close-modal__text">
              <div>Are you sure you want to delete this entry?</div>
              <div>All your entered data will be permanently removed.</div>
            </div>
            <div className="diary__buttons-modal">
              <Button className="diary__button" onClick={(e) => handleClickDelete(e)}>
                Yes, Delete
              </Button>
              <Button className="diary__button" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
