//@ts-nocheck
import React, { useState } from "react";
import DiaryHeaderClient from "./Header/DiaryHeaderClient";
import "./DiaryPage.css";
import DiaryEventDetailsClient from "./EventDetailsClient/EventDetailsClient";
import DiaryBlockAnalysisClient from "./DiaryBlockAnalysisClient/DiaryBlockAnalysisClient";
import DiaryBlockEmotionClient from "./DiaryBlockEmotionClient/DiaryBlockEmotionClient";
import DiaryBlockPhysicalSensationClient from "./DiaryBlockPhysicalSensationClient/DiaryBlockPhysicalSensationClient";
import DiaryFooterClient from "./DiaryFooterClient/DiaryFooterClient";
import { FormProvider, useForm } from "react-hook-form";
import { API } from "../../../service/axios";
import { useNavigate, useParams } from "react-router-dom";
import MobileEmotionPage from "../MyDiary/MobileEmotionPage/MobileEmotionPage";
import EntryNotComplete from '../../modals/Notifications/entryNotComplete';
import EntryUnsavedExit from '../../modals/Notifications/entryUnsavedExit';
import Modal from '../../modals/Modal/Modal';

export default function DiaryPageContentClient({ diary, type }) {
  //Changing card content and menu

  const navigate = useNavigate();
  const [statusMessageText, setStatusMessageText] = React.useState({
    text: null,
    status: null,
  });
  const [isSaved, setIsSaved] = useState(false);
  const params = useParams();
  const methods = useForm({
    defaultValues: {
      event_details: type == "create" ? "" : diary.event_details,
      thoughts_analysis: type == "create" ? "" : diary.thoughts_analysis,
      physical_sensations: type == "create" ? "" : diary.physical_sensations,
      emotion_type: type == "create" ? "" : diary.emotion_type,
      primary_emotion: type == "create" ? "" : diary.primary_emotion,
      clarifying_emotion: type == "create" ? [] : diary.clarifying_emotion,
      visible: false,
    },
    mode: "all",
  });

  const [showExitUnsaveModal, setShowExitUnsaveModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showEmotionsPage, setShowEmotionsPage] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [showModal, setShowModal] = useState(false);

  React.useEffect(() => {
    if (showModal) {
      setShowExitUnsaveModal(true);
    }
  }, [showModal]);

  // Ensure modal state is reset appropriately to hide it when needed
  React.useEffect(() => {
    if (!showExitUnsaveModal) {
      setShowModal(false); // Reset showModal when showExitUnsaveModal is set to false
    }
  }, [showExitUnsaveModal]);

  const onSubmit = async (data) => {
    console.log(data);

    if (type == "create") {
      try {
        const response = await API.post(`/diary-notes/`, data);
        setStatusMessageText({
          text: "Entry successfully saved",
          status: "success",
        });
        setIsSaved(true);
        if (!showEmotionsPage) {
          setTimeout(() => {
            setIsSaved(false);
            setChangesMade(false);
            setShowExitUnsaveModal(false);
            navigate("/my-diary");
          }, 1000);
        }

        return response.data;
      } catch (error) {
        console.log(error);
        if (error.response.status == 400) {
          setStatusMessageText({
            text: "Please fill in at least one question to save your diary entry",
            status: "error",
          });
        }
        if (error.response.status > 500) {
          setStatusMessageText({
            text: "Error server...",
            status: "error",
          });
        }
        console.log(error);
      }
    }
    if (type == "exist") {
      try {
        const response = await API.patch(`/diary-notes/${params.id}/`, data);
        setStatusMessageText({
          text: "Diary changed successfully",
          status: "success",
        });
        setIsSaved(true);
        if (!showEmotionsPage) {
          setTimeout(() => {
            setIsSaved(false);
            setChangesMade(false);
            setShowExitUnsaveModal(false);
            navigate("/my-diary");
          }, 1000);
        }

        return response.data;
      } catch (error) {
        if (error.response.status == 400) {
          setStatusMessageText({
            text: "Please fill in at least one question to save your diary entry",
            status: "error",
          });
        }

        if (error.response.status > 500) {
          setStatusMessageText({
            text: "Error server...",
            status: "error",
          });
        }
        console.log(error);
      }
    }
  };

  return (
    <form className="diaryPage" onSubmit={methods.handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
        {statusMessageText.status != null && (
          <div
            className={
              statusMessageText.status == "success"
                ? `success-message`
                : "error-message"
            }
          >
            {statusMessageText.text}
          </div>
        )}

        {!showEmotionsPage ? (
          <>
            <DiaryHeaderClient
              diary={diary}
              onSubmit={onSubmit}
              setShowExitUnsaveModal={setShowExitUnsaveModal}
              changesMade={changesMade}
              isSaved={isSaved}
              setShowModal={setShowModal}
            />
            <DiaryEventDetailsClient diary={diary} type={type} />
            <DiaryBlockAnalysisClient diary={diary} type={type} />
            <DiaryBlockEmotionClient
              diary={diary}
              type={type}
              setShowEmotionsPage={setShowEmotionsPage}
            />
            <DiaryBlockPhysicalSensationClient diary={diary} type={type} />
            <DiaryFooterClient diary={diary} setChangesMade={setChangesMade} />

            {showExitUnsaveModal && (
              <Modal>
                <EntryUnsavedExit
                  saveClick={methods.handleSubmit(onSubmit)}
                  discardClick={() => {
                    setShowExitUnsaveModal(false);
                    navigate('/my-diary');
                  }}
                />
              </Modal>
            )}

            {showCompleteModal ? <EntryNotComplete /> : null}
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
