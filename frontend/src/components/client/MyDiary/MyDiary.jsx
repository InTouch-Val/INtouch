import React from 'react';
import Button from '../../psy/button/ButtonHeadline';
import './MyDiary.css';
import addEntry from '../../../images/add_entry.svg';
import { API } from '../../../service/axios';
import CardDiaryClient from './CardDiary/CardDiary';
import { useNavigate } from 'react-router-dom';
import { useObserve } from '../../../utils/hook/useObserve';

export default function MyDiary() {
  const [diarys, setDiarys] = React.useState([]);
  const [isFetching, setFetching] = React.useState(false);
  const [isShowModal, setShowModal] = React.useState(false);
  const [idCardDelete, setIdCardDelete] = React.useState(false);
  const [offset, setOffset] = React.useState(0);

  const [isTotal, setTotal] = React.useState(false);
  const observeElement = React.useRef(null);

  const navigate = useNavigate();

  const handleTakeUpdate = React.useCallback(() => {
    setOffset((prevOffset) => prevOffset + 20);
  }, []);

  useObserve(observeElement, isTotal, handleTakeUpdate);

  React.useEffect(() => {
    const response = API.get(`diary-notes/?offset=${offset}`)
      .then((res) => {
        if (res.status == 200) {
          if (res.data.count === diarys.length) {
            setTotal(true);
          } else if (res.data.results.length > 0) {
            setDiarys([...diarys, ...res.data.results]);
            setTotal(false);
          }

          console.log(diarys);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setFetching(true));
  }, [isFetching, offset]);

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
            <button className="close-modal-button" onClick={closeModal}>
              &times;
            </button>
            <p>Are you sure you want to delete your diary?</p>
            <div className="diary__buttons-modal">
              <button className="action-button" onClick={(e) => handleClickDelete(e)}>
                Yes
              </button>
              <button className="action-button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
