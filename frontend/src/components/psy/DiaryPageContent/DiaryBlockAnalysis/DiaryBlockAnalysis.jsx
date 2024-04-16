import React from 'react';
import '../DiaryPageContent.css';

export default function DiaryBlockAnalysis({ diary }) {
  return (
    <div className="diary__block-event">
      <div className="diary__block-title">Thoughts Analysis</div>
      <div className="diary__block-question">
        Reflect on your thoughts related to the situation. What were you thinking?
      </div>
      <div className="diary__block-description">{diary.thoughts_analysis}</div>
    </div>
  );
}
