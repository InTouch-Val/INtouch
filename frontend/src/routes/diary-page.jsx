import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { API } from '../service/axios';
import DiaryPageContent from '../components/psy/DiaryPageContent/DiaryPageContent';
import { useAuth } from '../service/authContext';
import DiaryPageContentClient from '../components/client/DiaryPage/DiaryPageClient';

export const loaderDiaryById = async ({ params }) => {
  try {
    const response = await API.get(`/diary-notes/${params.id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export function DiaryPage() {
  const data = useLoaderData();
  const { currentUser } = useAuth();
  const user_type = currentUser.user_type;

  //todo: добавить крутилку на момент загрузки
  if (user_type == 'doctor') {
    return <DiaryPageContent diary={data} />;
  } else if (user_type == 'client') {
    return <DiaryPageContentClient diary={data} />;
  }
}
