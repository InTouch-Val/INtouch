//@ts-nocheck

import React from "react";
import "../DiaryPageContent.scss";
import { parseEventDetailsText } from "../../../../utils/helperFunction/parseEventDetailsText";

export default function DiaryBlockPhysicalSensation({ diary }) {
  return (
    <div className="diary__block-event">
      <div className="diary__block-title">Physical Sensations</div>
      <div className="diary__block-question">
        Describe any physical sensations or changes you noticed in your body.
        For example, tension, butterflies, etc.
      </div>
      <div className="diary__block-client-reply">
      <div dangerouslySetInnerHTML={{ __html: parseEventDetailsText(diary.physical_sensations)}} />
      </div>
    </div>
  );
}
