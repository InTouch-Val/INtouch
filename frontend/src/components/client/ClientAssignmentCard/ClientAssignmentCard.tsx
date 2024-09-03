import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./ClientAssignmentCard.css";
import { API } from "../../../service/axios";

function ClientAssignmentCard({ assignmentData, openAssignment }) {
  const [isShowContextMenu, setIsShowContextMenu] = useState(false);
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
      const res = await API.post(
        `assignments-client/${assignmentData?.id}/visible/`
      );
      if (res.status >= 200 && res.status < 300) {
        console.log(res.data);
        setIsShowContextMenu(false);
      } else {
        console.log(`Status: ${res.status}`);
      }
    } catch (error) {
      console.error(error.message);
      setIsShowContextMenu(false);
    }
  }

  function onCardClick() {
    openAssignment(assignmentData);
  }

  // close a context menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (isShowContextMenu && event.target !== buttonReference.current) {
        setIsShowContextMenu(false);
      }
    }

    if (isShowContextMenu) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isShowContextMenu]);

  //Changing card content and menu

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
        <span>Share with my therapist</span>
        <input
          type="checkbox"
          className="card__input-checkbox"
          defaultChecked={assignmentData?.visible}
          onClick={handleShareWithTherapist}
        />
      </label>
    </article>
  );
}

export { ClientAssignmentCard };
