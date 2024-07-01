//@ts-nocheck
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./ClientAssignmentCard.css";
import { API } from "../../../service/axios";
import useMobileWidth from "../../../utils/hook/useMobileWidth";
import {
  useCreateAssignmentMutation,
  useUpdateAssignmentByUUIDMutation,
} from "../../../store/entities/assignments/assingmentsApi";
import { StatusFromServer } from "../../psy/ClientAssignmentTile";

function ClientAssignmentCard({ assignmentData, openAssignment }) {
  const [isShowContextMenu, setIsShowContextMenu] = useState(false);
  const menuReference = useRef(null);
  const buttonReference = useRef(null);

  const [createAssignment, _] = useCreateAssignmentMutation();
  const [updateClientAssignment] = useUpdateAssignmentByUUIDMutation();

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
      setIsShowContextMenu(false);
    }
  }

  function showContextMenu() {
    setIsShowContextMenu(!isShowContextMenu);

    // check if the context menu is off-screen after it's shown
    setTimeout(() => {
      const menuRectangle = menuReference.current.getBoundingClientRect();
      const isOffScreen = menuRectangle.right > window.innerWidth;

      if (isOffScreen) {
        menuReference.current.style.left = "-120px";
      }
    }, 0);
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
  const isMobileWidth = useMobileWidth();

  function handleClickDuplicate() {
    const duplicateAssignmentData = {
      ...assignmentData,
      status: StatusFromServer.ToDo,
    };

    try {
      const response = createAssignment(duplicateAssignmentData);
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  function handleClickClear() {
    const clearAssignmentData = {
      ...assignmentData,
      status: StatusFromServer.ToDo,
      blocks: [],
      title: "",
      text: "",
    };

    const uuid = clearAssignmentData.id;

    try {
      const response = updateClientAssignment({ uuid, clearAssignmentData });
      return response;
    } catch (e) {
      console.log(e);
    }
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
        <div className="card__action-container">
          <button
            ref={buttonReference}
            className="card__action-button"
            type="button"
            aria-label="More actions..."
            onClick={showContextMenu}
          />

          {!isMobileWidth ? ( //Show menu only when not mobile width
            <menu // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
              ref={menuReference}
              className={`card__action-menu${isShowContextMenu ? "" : " card__action-menu_disabled"}`}
              onClick={(event) => event.stopPropagation()}
            >
              <li className="card__action-menu-item">
                <NavLink
                  to={`/my-assignments/${assignmentData?.id}`}
                  className="card__action-menu-text"
                >
                  Edit
                  <div
                    className="card__action-menu-icon card__action-menu-icon_type_edit"
                    aria-label="Edit"
                  />
                </NavLink>
              </li>
              <li className="card__action-menu-item">
                <button
                  type="button"
                  onClick={handleClickClear}
                  className="card__action-menu-text"
                  // disabled={true}
                >
                  Clear
                  <div
                    className="card__action-menu-icon card__action-menu-icon_type_clear"
                    aria-label="Clear"
                  />
                </button>
              </li>
              <li className="card__action-menu-item">
                <button
                  type="button"
                  onClick={handleClickDuplicate}
                  className="card__action-menu-text"
                >
                  Duplicate
                  <div
                    className="card__action-menu-icon card__action-menu-icon_type_duplicate"
                    aria-label="Duplicate"
                  />
                </button>
              </li>
            </menu>
          ) : null}
        </div>
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
          // Show the original label when not on mobile width
          <span>Share with my therapist</span>
        )}
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
