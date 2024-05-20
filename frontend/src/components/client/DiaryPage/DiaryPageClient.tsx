//@ts-nocheck
import React, { useState, useEffect } from 'react';
import DiaryHeaderClient from './Header/DiaryHeaderClient';
import './DiaryPage.css';
import DiaryEventDetailsClient from './EventDetailsClient/EventDetailsClient';
import DiaryBlockAnalysisClient from './DiaryBlockAnalysisClient/DiaryBlockAnalysisClient';
import DiaryBlockEmotionClient from './DiaryBlockEmotionClient/DiaryBlockEmotionClient';
import DiaryBlockPhysicalSensationClient from './DiaryBlockPhysicalSensationClient/DiaryBlockPhysicalSensationClient';
import DiaryFooterClient from './DiaryFooterClient/DiaryFooterClient';
import { FormProvider, useForm } from 'react-hook-form';
import { API } from '../../../service/axios';
import { useNavigate, useParams } from 'react-router-dom';
import MobileEmotionPage from '../MyDiary/MobileEmotionPage/MobileEmotionPage';

export default function DiaryPageContentClient({ diary, type }) {
  //Changing card content and menu

  const navigate = useNavigate();
  const [statusMessageText, setStatusMessageText] = React.useState({
    text: null,
    status: null,
  });
  const params = useParams();
  const methods = useForm({
    defaultValues: {
      event_details: type == 'create' ? '' : diary.event_details,
      thoughts_analysis: type == 'create' ? '' : diary.thoughts_analysis,
      physical_sensations: type == 'create' ? '' : diary.physical_sensations,
      emotion_type: type == 'create' ? '' : diary.emotion_type,
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
        setStatusMessageText({
          text: 'Entry successfully saved',
          status: 'success',
        });
        if (!showEmotionsPage) {
          setTimeout(() => {
            navigate('/my-diary');
          }, 1000);
        }

        return response.data;
      } catch (error) {
        console.log(error);
        if (error.response.status == 400) {
          setStatusMessageText({
            text: 'Please fill in at least one question to save your diary entry',
            status: 'error',
          });
        }
        if (error.response.status > 500) {
          setStatusMessageText({
            text: 'Error server...',
            status: 'error',
          });
        }

        console.log(error);
      }
    }
    if (type == 'exist') {
      try {
        const response = await API.patch(`/diary-notes/${params.id}/`, data);
        setStatusMessageText({
          text: 'Diary changed successfully',
          status: 'success',
        });
        if (!showEmotionsPage) {
          setTimeout(() => {
            navigate('/my-diary');
          }, 1000);
        }

        return response.data;
      } catch (error) {
        if (error.response.status == 400) {
          setStatusMessageText({
            text: 'Please fill in at least one question to save your diary entry',
            status: 'error',
          });
        }

        if (error.response.status > 500) {
          setStatusMessageText({
            text: 'Error server...',
            status: 'error',
          });
        }
        console.log(error);
      }
    }
  };

  const [showEmotionsPage, setShowEmotionsPage] = useState(false);

  return (
    <form className="diaryPage" onSubmit={methods.handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
        {statusMessageText.status != null && (
          <div
            className={statusMessageText.status == 'success' ? `success-message` : 'error-message'}
          >
            {statusMessageText.text}
          </div>
        )}

        {!showEmotionsPage ? (
          <>
            <DiaryHeaderClient diary={diary} onSubmit={onSubmit} />
            <DiaryEventDetailsClient diary={diary} type={type} />
            <DiaryBlockAnalysisClient diary={diary} type={type} />
            <DiaryBlockEmotionClient
              diary={diary}
              type={type}
              setShowEmotionsPage={setShowEmotionsPage}
            />
            <DiaryBlockPhysicalSensationClient diary={diary} type={type} />
            <DiaryFooterClient diary={diary} />
          </>
        ) : (
          <MobileEmotionPage
            type={type}
            id={params.id}
            setShowEmotionsPage={setShowEmotionsPage}
            diary={diary}
          />
        )}
      </FormProvider>
    </form>
  );
}
