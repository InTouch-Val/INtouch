import React from 'react';
import DiaryHeaderClient from './Header/DiaryHeaderClient';
import './DiaryPage.css';
import DiaryEventDetailsClient from './EventDetailsClient/EventDetailsClient';
import DiaryBlockAnalysisClient from './DiaryBlockAnalysisClient/DiaryBlockAnalysisClient';
import DiaryBlockEmotionClient from './DiaryBlockEmotionClient/DiaryBlockEmotionClient';
import DiaryBlockPhysicalSensationClient from './DiaryBlockPhysicalSensationClient/DiaryBlockPhysicalSensationClient';
import DiaryFooterClient from './DiaryFooterClient/DiaryFooterClient';
import { FormProvider, useForm } from 'react-hook-form';
import { API } from '../../../service/axios';
import { useParams } from 'react-router-dom';

export default function DiaryPageContentClient({ diary }) {
  const params = useParams();
  const methods = useForm({
    defaultValues: {
      event_details: diary.event_details,
      thoughts_analysis: diary.thoughts_analysis,
      physical_sensations: diary.physical_sensations,
      answer_emotion: diary.answer_emotion,
      primary_emotion: diary.primary_emotion,
      clarifying_emotion: diary.clarifying_emotion,
      visible: false,
    },
    mode: 'all',
  });

  const onSubmit = async (data) => {
    console.log(data);

    try {
      const response = await API.patch(`/diary-notes/${params.id}/`, data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="diaryPage" onSubmit={methods.handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
        <DiaryHeaderClient diary={diary} onSubmit={onSubmit} />
        <DiaryEventDetailsClient diary={diary} />
        <DiaryBlockAnalysisClient diary={diary} />
        <DiaryBlockEmotionClient diary={diary} />
        <DiaryBlockPhysicalSensationClient diary={diary} />
        <DiaryFooterClient diary={diary} />
      </FormProvider>
    </form>
  );
}
