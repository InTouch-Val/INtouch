import React from "react";
import "./Skeleton.stories";
import "./skeleton.css";

type Props = {
  /** which type of data is loading */
  type: "assignment" | "diary" | "other";
  user: "psy" | "client";
  variant?: "ps-my-tasks" | "ps-all-tasks" | "ps-share-task";
};

/**The skeleton is displayed while the component is loading */
const Skeleton = ({ type, user, variant }: Props) => {
  return (
    <>
      {type === "assignment" && user === "psy" && (
        <div className="skeleton">
          <div className="skeleton__header_wrapper">
            <div className="skeleton__header"></div>
            <div className="skeleton__header"></div>
          </div>
          <div className="skeleton__body"></div>
          <div className="skeleton__footer"></div>
          <div className="skeleton__footer_low"></div>

          <div className="lower_section">
            <div
              className={`lower_section_left ${variant === "ps-my-tasks" ? "invisible" : ""}`}
            ></div>
            <div
              className={`lower_section_right ${variant === "ps-my-tasks" ? "invisible" : ""}`}
            ></div>

            <div
              className={`lower_section_third ${variant === "ps-all-tasks" || variant === "ps-share-task" ? "invisible" : ""}`}
            ></div>
          </div>
        </div>
      )}
      {type === "diary" && user === "psy" && (
        <div className="skeleton" style={{gap: 20}}>
          <div className="skeleton__body" style={{height: 70}}></div>
          <div className="skeleton__footer"  style={{height: 70}}></div>
          <div className="skeleton__footer_low"  style={{height: 35}}></div>
        </div>
      )}
    </>
  );
};

export default Skeleton;
