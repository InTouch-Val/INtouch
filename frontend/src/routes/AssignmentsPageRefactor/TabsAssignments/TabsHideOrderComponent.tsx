import React from "react";
import { useAuth } from "../../../service/authContext";
import { API } from "../../../service/axios";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import TabLibrary from "./TabLibrary";
import { changeAssignmentFavoriteByIdAction } from "../../../store/actions/assignment/assignmentActions";

const getObjectFromEditorState = (editorState) => JSON.stringify(editorState);

export default function TabsHideOrderComponent({
  filteredAssignments,
  isShareModal = false,
}) {
  //@ts-ignore
  const { currentUser } = useAuth();
  const [userFavorites, setUserFavorites] = React.useState<string[]>([]);

  const [assignment, setAssignments] = React.useState<any>([]); // избавиться и использовать filteredAssignments

  const [selectedAssignmentId, setSelectedAssignmentId] = React.useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const { activeTab } = useAppSelector((state) => state.assignment);

  const dispatch = useAppDispatch();

  const toggleFavorite = async (assignmentId: number | string) => {
    const isFavorite = userFavorites.includes(`${assignmentId}`);
    dispatch(
      changeAssignmentFavoriteByIdAction({
        isFavorite: isFavorite,
        assignmentId: assignmentId,
      })
    );
  };

  //удаление через редакс
  const handleDeleteClick = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setIsDeleteModalOpen(true);
  };

  const handleShareButton = (assignmentId) => {
    if (isShareModal) {
      // setSelectedAssignmentIdForShareModalOnClientPage(assignmentId);
    } else {
      setSelectedAssignmentId(assignmentId);
      setIsShareModalOpen(true);
    }
  };

  //избавиться от этой функции
  const duplicateAssignment = async (assignmentId) => {
    try {
      const response = await API.get(`assignments/${assignmentId}/`);
      let assignmentData = response.data;
      console.log(assignmentData);

      // Подготавливаем данные для дубликата, используя ту же структуру, что и в handleSubmit
      const blockInfo = assignmentData.blocks.map((block) => {
        if (block.type === "text") {
          return {
            type: block.type,
            question: block.question,
            description: getObjectFromEditorState(block.content),
            choice_replies: [],
          };
        }
        if (block.type === "range") {
          return {
            type: block.type,
            question: block.question,
            start_range: block.minValue,
            end_range: block.maxValue,
            left_pole: block.leftPole || "Left Pole",
            right_pole: block.rightPole || "Right Pole",
          };
        }
        if (block.type === "image") {
          return {
            type: block.type,
            question: block.question,
            image: block.image,
          };
        }
        if (block.type === "open") {
          return {
            type: block.type,
            question: block.question,
          };
        }
        return {
          type: block.type,
          question: block.question,
          choice_replies: block.choice_replies,
        };
      });

      const duplicateData = {
        blocks: blockInfo,
        title: assignmentData.title + " COPY",
        text: assignmentData.text,
        assignment_type: assignmentData.assignment_type,
        tags: assignmentData.tags,
        language: assignmentData.language,
        image_url:
          assignmentData.image_url ||
          "https://images.unsplash.com/photo-1641531316051-30d6824c6460?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1MzE0ODh8MHwxfHNlYXJjaHwxfHxsZW9uaWR8ZW58MHx8fHwxNzAwODE4Nzc5fDA&ixlib=rb-4.0.3&q=85",
      };

      // Отправляем данные задания на сервер для создания дубликата
      const duplicateResponse = await API.post(`assignments/`, duplicateData);
      if (
        !duplicateResponse ||
        !duplicateResponse.data ||
        !duplicateResponse.data.id
      ) {
        throw new Error("Failed to create assignment");
      }
      // Получаем ID созданного задания
      const responseAssignmentId = duplicateResponse.data.id;

      // Если задание должно быть сохранено как черновик, выполняем GET запрос
      await API.get(`assignments/${responseAssignmentId}/draft/`);
      duplicateResponse.data.is_public = false;

      // Если все прошло успешно, добавляем дубликат в список заданий
      if (duplicateResponse.status === 201) {
        setAssignments((prevAssignments) => [
          ...prevAssignments,
          duplicateResponse.data,
        ]);
      }
    } catch (error) {
      console.error("Error duplicating assignment:", error);
    }
  };

  //из 3 табов сделать 1
  return (
    <>
      {activeTab == "library" && (
        <TabLibrary
          filteredAssignments={filteredAssignments}
          isShareModal={isShareModal}
          toggleFavorite={toggleFavorite}
          handleDeleteClick={handleDeleteClick}
          duplicateAssignment={duplicateAssignment}
          handleShareButton={handleShareButton}
          // selectedAssignmentIdForShareModalOnClientPage={
          //   selectedAssignmentIdForShareModalOnClientPage
          // }
        />
      )}
      {activeTab == "favorites" && (
        <TabLibrary
          filteredAssignments={filteredAssignments}
          isShareModal={isShareModal}
          toggleFavorite={toggleFavorite}
          handleDeleteClick={handleDeleteClick}
          duplicateAssignment={duplicateAssignment}
          handleShareButton={handleShareButton}
          // selectedAssignmentIdForShareModalOnClientPage={
          //   selectedAssignmentIdForShareModalOnClientPage
          // }
        />
      )}
      {activeTab == "my-list" && (
        <TabLibrary
          filteredAssignments={filteredAssignments}
          isShareModal={isShareModal}
          toggleFavorite={toggleFavorite}
          handleDeleteClick={handleDeleteClick}
          duplicateAssignment={duplicateAssignment}
          handleShareButton={handleShareButton}
          // selectedAssignmentIdForShareModalOnClientPage={
          //   selectedAssignmentIdForShareModalOnClientPage
          // }
        />
      )}
    </>
  );
}
