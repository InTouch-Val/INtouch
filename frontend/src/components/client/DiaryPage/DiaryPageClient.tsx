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
import EntryUnsavedExit from "../../modals/Notifications/entryUnsavedExit";
import EntryNotComplete from "../../modals/Notifications/entryNotComplete";
import Modal from "../../modals/Modal/Modal";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  selectShowModalExitUnsaved,
  selectShowModalSaveIncomplete,
} from "../../../store/slices/modals/modalsSlice";
import {
  closeModalExitUnsaved,
  closeModalSaveIncomplete,
} from "../../../store/slices/modals/modalsSlice";
import { diaryClientValidation } from "../../../routes/SettingPage/ProfileTab/schemaValid";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClientDiary } from "../../../store/entities/assignments/types";
import { ClientDiaryEntry } from "../../../store/entities/assignments/types";

export default function DiaryPageContentClient({
  diary,
  type,
}: {
  diary: ClientDiary | null;
  type: string;
}) {
  const dispatch = useAppDispatch();
  const showModalExitUnsaved = useAppSelector(selectShowModalExitUnsaved);
  const showModalSaveIncomplete = useAppSelector(selectShowModalSaveIncomplete);

  const navigate = useNavigate();
  const [statusMessageText, setStatusMessageText] = React.useState({
    text: null,
    status: null,
  });
  const [isSaved, setIsSaved] = useState(false);
  const params = useParams();
  const methods = useForm({
    resolver: yupResolver(diaryClientValidation),
    defaultValues: {
      event_details: type === "create" ? "" : diary?.event_details || "",
      thoughts_analysis:
        type === "create" ? "" : diary?.thoughts_analysis || "",
      physical_sensations:
        type === "create" ? "" : diary?.physical_sensations || "",
      emotion_type: type === "create" ? "" : diary?.emotion_type || "",
      primary_emotion: type === "create" ? "" : diary?.primary_emotion || "",
      clarifying_emotion:
        type === "create" ? [] : diary?.clarifying_emotion || [],
      visible: false,
    },
    mode: "all",
  });

  const [showEmotionsPage, setShowEmotionsPage] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [showInputsincomplete, setShowInputsincomplete] = useState(false);

  const handleCloseExitModal = () => {
    dispatch(closeModalExitUnsaved());
  };

  const handleCloseSaveIncompleteModal = () => {
    dispatch(closeModalSaveIncomplete());
  };

  const onSubmit = async (data: ClientDiaryEntry) => {
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
            handleCloseExitModal();
            handleCloseSaveIncompleteModal();
            setShowInputsincomplete(false);
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
            handleCloseExitModal();
            handleCloseSaveIncompleteModal();
            setShowInputsincomplete(false);
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
              changesMade={changesMade}
              isSaved={isSaved}
            />
            <DiaryEventDetailsClient
              diary={diary}
             
              showInputsincomplete={showInputsincomplete}
            />
            <DiaryBlockAnalysisClient
              diary={diary}
             
              showInputsincomplete={showInputsincomplete}
            />
            <DiaryBlockEmotionClient
              diary={diary}
              setShowEmotionsPage={setShowEmotionsPage}
              showInputsincomplete={showInputsincomplete}
            />
            <DiaryBlockPhysicalSensationClient
              diary={diary}
             
              showInputsincomplete={showInputsincomplete}
            />
            <DiaryFooterClient
              diary={diary}
              setChangesMade={setChangesMade}
              setShowInputsincomplete={setShowInputsincomplete}
            />

            {showModalExitUnsaved && (
              <Modal>
                <EntryUnsavedExit
                  saveClick={methods.handleSubmit(onSubmit)}
                  discardClick={() => {
                    handleCloseExitModal();
                    navigate("/my-diary");
                  }}
                />
              </Modal>
            )}

            {showModalSaveIncomplete && (
              <Modal>
                <EntryNotComplete
                  completeClick={methods.handleSubmit(onSubmit)}
                  backClick={() => {
                    handleCloseSaveIncompleteModal();
                  }}
                />
              </Modal>
            )}
          </>
        ) : (
          <MobileEmotionPage
            type={type}
            id={params.id}
            setShowEmotionsPage={setShowEmotionsPage}
          />
        )}
      </FormProvider>
    </form>
  );
}
