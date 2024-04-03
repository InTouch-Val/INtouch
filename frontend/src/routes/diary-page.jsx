import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { API } from '../service/axios';
import DiaryPageContent from '../components/psy/DiaryPageContent/DiaryPageContent';

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
  return <DiaryPageContent diary={data} />;
}
