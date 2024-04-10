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

export default function DiaryPageContentClient({ diary, type }) {
  const params = useParams();
  const methods = useForm({
    defaultValues: {
      event_details: type == 'create' ? '' : diary.event_details,
      thoughts_analysis: type == 'create' ? '' : diary.thoughts_analysis,
      physical_sensations: type == 'create' ? '' : diary.physical_sensations,
      answer_emotion: type == 'create' ? '' : diary.answer_emotion,
      primary_emotion: type == 'create' ? '' : diary.primary_emotion,
      clarifying_emotion: type == 'create' ? [] : diary.clarifying_emotion,
      visible: false,
    },
    mode: 'all',
  });

  const onSubmit = async (data) => {
    console.log(data);

    if (type == 'create') {
      try {
        const response = await API.post(`/diary-notes/`, data);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
    if (type == 'exist') {
      try {
        const response = await API.patch(`/diary-notes/${params.id}/`, data);
        return response.data;
      } catch (error) {
        console.log(error);
      }
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
