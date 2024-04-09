import React from 'react';
import DiaryHeader from '../../psy/DiaryPageContent/DiaryHeader/DiaryHeader';
import './DiaryPageContent.css';
import DiaryEventDetails from './DiaryEventDetails/DiaryEventDetails';
import DiaryBlockAnalysis from './DiaryBlockAnalysis/DiaryBlockAnalysis';
import DiaryBlockPhysicalSensation from './DiaryBlockPhysicalSensation/DiaryBlockPhysicalSensation';
import DiaryBlockEmotion from './DiaryBlockEmotion/DiaryBlockEmotion';

export default function DiaryPageContent({ diary }) {
  console.log(diary);
  return (
    <div className="diaryPage">
      <DiaryHeader diary={diary} />

      <DiaryEventDetails diary={diary} />
      <DiaryBlockAnalysis diary={diary} />
      <DiaryBlockEmotion diary={diary} />
      <DiaryBlockPhysicalSensation diary={diary} />
    </div>
  );
}
