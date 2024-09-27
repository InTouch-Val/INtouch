//@ts-nocheck
import React from "react";
import "./HeaderAssignment.scss";
import arrowBack from "../../../images/assignment-page/arrowBack.svg";
import save from "../../../images/assignment-page/save.svg";
import eye from "../../../images/assignment-page/eye.svg";
import { useNavigate } from "react-router-dom";

export default function HeaderAssignment({
  blocks,
  handleSubmit = () => {},
  isFirstEntry,
  changeView,
  isDisabled,
  isChangeView,
  title,
}) {
  const navigate = useNavigate();
  const disableButton = isDisabled || blocks.length === 0;

  function onBack() {
    navigate(-1);
  }

  return (
    <>
      <header className="headerAssignment">
        <div className="header__wrapper">
          <h1 className={isChangeView ? "header__view" : ""}>
            {isChangeView ? title : "Add Assignment"}
          </h1>
          <div className="header__buttons">
            {!isChangeView ? (
              <>
                <button onClick={onBack}>
                  <img
                    className="header__icon-back"
                    alt="back"
                    src={arrowBack}
                  />
                </button>
                <button onClick={handleSubmit} disabled={disableButton}>
                  <img
                    className={
                      disableButton
                        ? "header__icon-save-disabled"
                        : "header__icon-save"
                    }
                    alt="save"
                    src={save}
                  />
                </button>
                <button
                  onClick={changeView}
                  disabled={disableButton}
                  id="onboarding-constructorPreview"
                >
                  <img
                    className={
                      disableButton
                        ? " header__icon-eye-disabled"
                        : "header__icon-eye"
                    }
                    alt="changeView"
                    src={eye}
                  />
                </button>
              </>
            ) : (
              <button onClick={changeView}>
                <img
                  className={"header__icon-eye"}
                  alt="changeView"
                  src={arrowBack}
                />
              </button>
            )}
          </div>
        </div>
        <span
          id="errorText"
          className={`error__text error__text_header ${isDisabled && !isFirstEntry ? "error__text_span" : ""}`}
        >
          Please check all fields
        </span>
      </header>
    </>
  );
}
