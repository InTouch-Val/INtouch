//@ts-nocheck
import React from "react";
import "../DiaryPageContent.css";

export default function DiaryEventDetails({ diary }) {
  return (
    <div className="diary__block-event">
      <div className="diary__block-title">Event Details</div>
      <div className="diary__block-question">
        Describe the event or situation that evoked emotions. What happened?
      </div>
      <div className="diary__block-text">{diary.event_details}</div>
    </div>
  );
}
