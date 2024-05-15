//@ts-nocheck
import React from 'react';
import './HeaderAssignment.css';
import arrowBack from '../../../images/assignment-page/arrowBack.svg';
import save from '../../../images/assignment-page/save.svg';
import eye from '../../../images/assignment-page/eye.svg';
import { useNavigate } from 'react-router-dom';

export default function HeaderAssignment({ blocks, handleSubmit, errorText, changeView, isError }) {
  const navigate = useNavigate();

  function onBack() {
    navigate(-1);
  }

  return (
    <>
      <header className="headerAssignment">
        <div className="header__wrapper">
          <h1>Add Assignment</h1>
          <div className="header__buttons">
            <img className="header__icon-back" alt="back" src={arrowBack} onClick={onBack} />
            <img
              className={blocks.length > 0 ? 'header__icon-save' : 'header__icon-save-disabled'}
              alt="save"
              src={save}
              onClick={handleSubmit}
            />
            <img className="header__icon-eye" alt="changeView" src={eye} onClick={changeView} />
          </div>
        </div>
        <span id="errorText" className="error__text error__text_header">
          {errorText || (isError && 'Please check all fields')}
        </span>
      </header>
    </>
  );
}
