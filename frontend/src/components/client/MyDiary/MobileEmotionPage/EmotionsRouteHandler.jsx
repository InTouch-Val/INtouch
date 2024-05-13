import React from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import MobileEmotionPage from './MobileEmotionPage';
import { API } from '../../../../service/axios';
import { useForm, FormProvider } from 'react-hook-form';

export const loaderEmotionsById = async ({ params }) => {
  try {
    const response = await API.get(`/diary-notes/${params.id}`);
    return response.data || null;
  } catch (error) {
    return null;
  }
};

export default function MobileEmotionsRouteHandler({ type }) {
  let { id } = useParams();
  const diary = useLoaderData();

  const onSubmit = async (data) => {
    try {
      let response;
      if (type === 'exist') {
        response = await API.patch(`/diary-notes/${id}/`, data);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const methods = useForm({
    defaultValues: {
      event_details: type === 'create' ? '' : diary.event_details,
      thoughts_analysis: type === 'create' ? '' : diary.thoughts_analysis,
      physical_sensations: type === 'create' ? '' : diary.physical_sensations,
      emotion_type: type === 'create' ? '' : diary.emotion_type,
      primary_emotion: type === 'create' ? '' : diary.primary_emotion,
      clarifying_emotion: type === 'create' ? [] : diary.clarifying_emotion,
      visible: false,
    },
    mode: 'all',
  });

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
        <MobileEmotionPage type={type} id={id} />
      </FormProvider>
    </form>
  );
}
