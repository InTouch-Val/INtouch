import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./ClientAssignmentCard.css";
import { API } from "../../../service/axios";
import useMobileWidth from "../../../utils/hook/useMobileWidth";
import { useCreateAssignmentMutation } from "../../../store/entities/assignments/assingmentsApi";
import { StatusFromServer } from "../../psy/ClientAssignmentTile";
import { clientAssignmentClear } from "../../../store/actions/assignment/assignmentActions";
import { useAppDispatch } from "../../../store/store";
import Tumbler from "../../tumbler/Tumbler";


function ClientAssignmentCard({ assignmentData, openAssignment }) {
  const buttonReference = useRef(null);

  function defineStatusClass() {
    switch (assignmentData?.status) {
      case "to do": {
        return "card__status_status_to-do";
      }
      case "in progress": {
        return "card__status_status_in-progress";
      }
      case "done": {
        return "card__status_status_done";
      }
      default: {
        return "";
      }
    }
  }

  async function handleShareWithTherapist() {
    try {

      const res = await API.patch(
        `assignments-client/${assignmentData?.id}/visible/`,
      );
      if (res.status >= 200 && res.status < 300) {
        console.log(res.data);
        setIsShowContextMenu(false);
      } else {
        console.log(`Status: ${res.status}`);
      }

    } catch (error) {
      console.error(error.message);
    }
  }

  function onCardClick() {
    openAssignment(assignmentData);
  }

  return (
    <article className="card">
      <NavLink
        to={`/my-assignments/${assignmentData?.id}`}
        className="card__clickable-container"
        onClick={onCardClick}
      >
        <div className="card__wrapper-container">
          <span className="card__date">
            {new Date(assignmentData?.add_date)?.toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className={`card__status ${defineStatusClass()}`}>
            {/* eslint-disable-next-line no-unsafe-optional-chaining */}
            {assignmentData?.status[0]?.toUpperCase() +
              assignmentData?.status?.slice(1)}
          </span>
        </div>
        <img
          className="card__image"
          src={assignmentData?.image_url}
          alt="assignment"
        />
      </NavLink>
      <div className="card__wrapper-container">
        <h3 className="card__title" title={assignmentData?.title}>
          {assignmentData?.title}
        </h3>
        <div className="card__action-container"></div>
      </div>
      <label className="card__input-label">

        {isMobileWidth ? (
          // Show menu options when on mobile width
          <div className="mobile_menu_container">
            <button
              type="button"
              className="card__action-menu-text"
              onClick={handleClickDuplicate}
            >
              <div
                className="card__action-menu-icon card__action-menu-icon_type_duplicate"
                aria-label="Duplicate"
              />
            </button>
            <button
              type="button"
              className="card__action-menu-text"
              // disabled={true}
              onClick={handleClickClear}
            >
              <div
                className="card__action-menu-icon card__action-menu-icon_type_clear"
                aria-label="Clear"
              />
            </button>
          </div>
        ) : (
          <Tumbler
            active={assignmentData?.visible}
            handleClick={handleShareWithTherapist}
            label={"Share with my therapist"}
          />
        )}
        {isMobileWidth && (
          <Tumbler
            active={assignmentData?.visible}
            handleClick={handleShareWithTherapist}
            label={"Share with my therapist"}
          />
        )}
      </label>
    </article>
  );
}

export { ClientAssignmentCard };
