//@ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorState, ContentState, convertFromRaw } from "draft-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faSquareCheck,
  faCircleDot,
  faEllipsis,
  faImage,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { API } from "../../service/axios";
import { AssignmentBlock } from "../../service/psyAssignment/AssignmentBlock";
import { ImageSelector } from "../../service/image-selector";
import { useAuth } from "../../service/authContext";
import { Modal } from "../../service/modal";
import { Headline } from "./Headline";
import { ImageQuestionBlock } from "./ImageQuestionBlock";
import { ClientAssignmentBlocks } from "../../service/ClientAssignmentBlocks";
import decodeStyledText from "../../service/decodeStyledText";
import HeadlinerImg from "./HeadlinerImg/HeadlinerImg";
import "../../css/assignments.css";
import HeaderAssignment from "./HeaderAssigmentPage/HeaderAssignment";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { updateForm } from "../../store/slices/add-assignment/form";
import {
  addBlock,
  removeBlock,
  updateBlock,
  setBlocks,
} from "../../store/slices/add-assignment/blocks";
import {
  Block,
  AssignmentData,
  UpdateBlockAction,
  AssignmentReqData,
} from "../../store/entities/add-assignment/types";
import {
  fetchAssignmentById,
  createAssignment,
  updateAssignment,
  saveAsDraft,
} from "../../store/actions/add-assignment/addAssAct";
import {
  setError,
  clearErrors,
} from "../../store/slices/add-assignment/errorsSlice";

function AddAssignment() {
  const dispatch = useAppDispatch();
  const blocks = useAppSelector((state) => state.blocks.blocks);
  const MemoizedHeadline = React.memo(Headline); //предотвращения ненужных перерендеров
  const MemoizedImageQuestionBlock = React.memo(ImageQuestionBlock); //предотвращения ненужных перерендеров

  const {
    title,
    description,
    type,
    language,
    selectedImage,
    successMessage,
    successMessageText,
    selectedImageForBlock,
    isChangeView,
    isError,
  } = useAppSelector((state) => state.formAddAssignment);

  const [hasScrolled, setHasScrolled] = useState(false);
  const errorMessages = useAppSelector((state) => state.errors.messages);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id != undefined;

  const handleAddBlock = useCallback(
    (type: string) => {
      dispatch(addBlock({ type }));
    },
    [dispatch]
  );

  const handleRemoveBlock = useCallback(
    (blockId: number) => {
      dispatch(removeBlock({ blockId }));
    },
    [dispatch]
  );

  const handleUpdateBlock = useCallback(
    (updates: UpdateBlockAction["payload"]) => {
      dispatch(updateBlock(updates));
    },
    [dispatch]
  );

  const handleImageSelect = (image) => {
    dispatch(updateForm({ selectedImage: image }));
  };

  const handleImgSelectForBlock = (image) => {
    dispatch(updateForm({ selectedImageForBlock: image }));
  };

  const copyBlock = useCallback(
    (blockId: number) => {
      const blockIndex = blocks.findIndex((b) => b.id === blockId);
      if (blockIndex !== -1) {
        const blockCopy = { ...blocks[blockIndex], id: Date.now() };
        dispatch(
          setBlocks((prevBlocks) => [
            ...prevBlocks.slice(0, blockIndex),
            blockCopy,
            ...prevBlocks.slice(blockIndex + 1),
          ])
        );
      }
    },
    [blocks, dispatch]
  );

  const moveBlockForward = useCallback(
    (blockId: number) => {
      const blockIndex = blocks.findIndex((b) => b.id === blockId);
      if (blockIndex < blocks.length - 1) {
        // Проверяем, не является ли текущий блок последним
        const updatedBlocks = [...blocks]; // Создаем копию массива блоков
        const movingBlock = updatedBlocks.splice(blockIndex, 1)[0]; // Удаляем блок из текущей позиции
        updatedBlocks.splice(blockIndex + 1, 0, movingBlock); // Вставляем блок на новую позицию
        dispatch(setBlocks(updatedBlocks)); // Обновляем состояние
      }
    },
    [blocks, dispatch]
  );

  const moveBlockBackward = useCallback(
    (blockId: number) => {
      const blockIndex = blocks.findIndex((b) => b.id === blockId);
      if (blockIndex > 0) {
        // Проверяем, не является ли текущий блок первым
        const updatedBlocks = [...blocks]; // Создаем копию массива блоков
        const movingBlock = updatedBlocks.splice(blockIndex, 1)[0]; // Удаляем блок из текущей позиции
        updatedBlocks.splice(blockIndex - 1, 0, movingBlock); // Вставляем блок на новую позицию
        dispatch(setBlocks(updatedBlocks)); // Обновляем состояние
      }
    },
    [blocks, dispatch]
  );

  useEffect(() => {
    if (title.length > 2 && description.length > 2) {
      dispatch(clearErrors());

      const titleElement = document.getElementById("title");

      const textElement = document.getElementById("text");
      titleElement.classList.remove("error");
      textElement.classList.remove("error");
    }
  }, [title, description]);

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        const resultAction = await dispatch(fetchAssignmentById(id));

        if (resultAction.type.endsWith("/fulfilled")) {
          const response = resultAction.payload;

          dispatch(
            updateForm({
              title: response.title,
              description: response.text,
              type: response.assignment_type,
              language: response.language,
              selectedImage: { urls: { full: response.image_url } },
            })
          );

          const fetchedBlocks = response.blocks.map((block) => {
            let contentState;
            try {
              contentState = ContentState.createFromText(block.question);
            } catch (error) {
              console.error("Ошибка при обработке содержимого:", error);
            }

            switch (block.type) {
              case "text":
                return {
                  ...block,
                  content: EditorState.createWithContent(contentState),
                };
              case "single":
              case "multiple":
                return {
                  ...block,
                  choices: block.choice_replies.map((choice) => choice.reply),
                  content: EditorState.createWithContent(contentState),
                };
              case "range":
                return {
                  ...block,
                  minValue: block.start_range,
                  maxValue: block.end_range,
                  content: EditorState.createWithContent(contentState),
                };
              case "image":
                return {
                  ...block,
                  content: EditorState.createWithContent(contentState),
                  image: block.image,
                };
              default:
                return block;
            }
          });

          dispatch(setBlocks(fetchedBlocks));
        }
      };

      fetchData();
    }
  }, [isEditMode, dispatch]);

  function parseErrorText(errorText) {
    const errors = JSON.parse(errorText);
    const errorMessages = {};

    Object.keys(errors).forEach((key) => {
      if (Array.isArray(errors[key])) {
        errors[key].forEach((message, index) => {
          errorMessages[`${key} #${index + 1}`] = message;
        });
      } else {
        errorMessages[key] = errors[key];
      }
    });

    return errorMessages;
  }

  const handleSubmit = async (e, isDraft = false, isSaveAsDraft = false) => {
    e.preventDefault();

    const blockInfo = blocks.map((block) => {
      if (block.type === "text" || block.type === "open") {
        return {
          type: block.type,
          question: block.question || block.title,
          description: block.description,
        };
      }
      if (block.type === "range") {
        return {
          type: block.type,
          question: block.question || block.title,
          start_range: block.minValue,
          end_range: block.maxValue,
          left_pole: block.leftPole || "Left Pole",
          right_pole: block.rightPole || "Right Pole",
          description: block.description,
        };
      }
      if (block.type === "image") {
        return {
          type: block.type,
          question: block.question || block.title,
          ...(selectedImageForBlock && { image: selectedImageForBlock.url }),
          description: block.description,
        };
      }
      return {
        type: block.type,
        question: block.question || block.title,
        choice_replies: block.choice_replies,
        description: block.description,
      };
    });

    const requestData: AssignmentReqData = {
      blocks: blockInfo,
      title,
      text: description,
      assignment_type: type,
      tags: "ffasd",
      language,
      image_url:
        selectedImage?.urls.small ||
        selectedImage?.urls.full ||
        "https://images.unsplash.com/photo-1641531316051-30d6824c6460?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1MzE0ODh8MHwxfHNlYXJjaHwxfHxsZW9uaWR8ZW58MHx8fHwxNzAwODE4Nzc5fDA&ixlib=rb-4.0.3&q=85",
    };

    try {
      if (!isEditMode) {
        // Используем createAssignment для создания нового задания
        dispatch(createAssignment({ requestData }));
      } else {
        // Используем updateAssignment для обновления существующего задания
        dispatch(updateAssignment({ id, requestData }));
      }

      // После отправки действия, вы можете использовать селекторы для получения актуального состояния
      const assignmentStatus = useSelector(
        (state) => state.addAssignment.status
      );
      const assignmentError = useSelector((state) => state.addAssignment.error);

      // Проверяем статус асинхронного действия
      if (assignmentStatus === "fulfilled") {
        const assignment = useSelector((state) => state.addAssignment.entity);
        if (assignment && assignment.id) {
          if (isDraft || isSaveAsDraft) {
            // Логика сохранения черновика или обновления существующего задания
            await dispatch(saveAsDraft({ assignmentId })).unwrap();
          } else {
            // Переход на страницу с заданиями после успешного создания
            setTimeout(() => {
              navigate("/assignments");
            }, 2000);
          }
          setSuccessMessageText("Assignment created successfully");
          setSuccessMessage(true);
        }
      } else if (assignmentStatus === "rejected" && assignmentError) {
        const errorTextString = Object.entries(assignmentError)
          .map(([key, message]) => `${key}: ${message}`)
          .join(", ");
        dispatch(
          setError(`Please correct the following errors: ${errorTextString}`)
        );
        console.error("Error creating assignment", assignmentError);
        displayErrorMessages(assignmentError);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  useEffect(() => {
    if (Object.keys(errorMessages).length > 0) {
      const targetElement = document.getElementById("errorText");
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
      setHasScrolled(false);
    }
  }, [errorMessages, hasScrolled]);

  function displayErrorMessages(errorMessages) {
    console.log(errorMessages);
    if (errorMessages.title) {
      const titleElement = document.getElementById("title");
      titleElement.classList.add("error");
    }
    if (errorMessages.description) {
      const textElement = document.getElementById("text");
      textElement.classList.add("error");
    }
    const blockContainers = document.querySelectorAll(".block");
    blockContainers.forEach((blockContainer, index) => {
      const blockErrorKey = `blocks #${index + 1}`;
      const blockErrorExists = Object.keys(errorMessages).some((key) =>
        key.startsWith(blockErrorKey)
      );
      if (blockErrorExists) {
        blockContainer.classList.add("error");
      }
    });
  }

  return (
    <div className="assignments-page">
      {successMessage && (
        <div className="success-message">{successMessageText}</div>
      )}
      <HeaderAssignment
        blocks={blocks}
        handleSubmit={(e) => handleSubmit(e, true, false)}
        errorText={errorMessages}
        isError={isError}
        changeView={() => {
          setChangeView((prev) => !prev);
        }}
      />
      <div className="form-title">
        <input
          type="text"
          className="title-input"
          placeholder="Name of Assignment..."
          value={title}
          onChange={(e) => dispatch(updateForm({ title: e.target.value }))}
          required
          id="title"
        />
        <input
          type="text"
          className="title-input"
          placeholder="Description..."
          value={description}
          onChange={(e) =>
            dispatch(updateForm({ description: e.target.value }))
          }
          required
          id="text"
        />
      </div>
      <div className="add-assignment-body">
        <ImageSelector
          onImageSelect={handleImageSelect}
          selectedImage={selectedImage}
        />
        <form
          onSubmit={(e) => handleSubmit(e, false, false)}
          className="form-creator"
        >
          {blocks.map((block, index) => (
            <div key={index}>
              {block.type === "headline" && (
                <MemoizedHeadline
                  block={block}
                  updateBlock={handleUpdateBlock}
                />
              )}
              {block.type === "imageQuestion" && (
                <MemoizedImageQuestionBlock
                  block={block}
                  updateBlock={handleUpdateBlock}
                />
              )}
              {block.type === "headlinerImg" && (
                <HeadlinerImg
                  block={block}
                  updateBlock={handleUpdateBlock}
                  setSelectedImageForBlock={setSelectedImageForBlock}
                />
              )}
            </div>
          ))}
          <div className="form-settings">
            <div className="form-setting">
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="lesson">Lesson</option>
                <option value="exercise">Exercise</option>
                <option value="essay">Essay</option>
                <option value="study">Study</option>
                <option value="quiz">Quiz</option>
                <option value="methology">Methodology</option>
                <option value="metaphor">Metaphor</option>
              </select>
            </div>
            <div className="form-setting">
              <label>Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="ge">German</option>
                <option value="it">Italian</option>
              </select>
            </div>
            {/* <div className="form-setting tags-setting">
              <label>Tags</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div> */}
          </div>
          {isChangeView ? (
            <>
              {Array.from(blocks).map((block, index) => (
                <ClientAssignmentBlocks
                  key={index}
                  block={block}
                  updateBlock={handleUpdateBlock}
                  isView={true}
                  isViewPsy={true}
                />
              ))}
            </>
          ) : (
            <>
              {blocks.map((block, index) => (
                <AssignmentBlock
                  key={block.id}
                  block={block}
                  updateBlock={handleUpdateBlock}
                  removeBlock={handleRemoveBlock}
                  copyBlock={copyBlock}
                  moveBlockForward={moveBlockForward}
                  moveBlockBackward={moveBlockBackward}
                  index={index}
                  setSelectedImageForBlock={handleImgSelectForBlock}
                  setIsError={setIsError}
                />
              ))}
            </>
          )}
        </form>
        <div className="block-buttons-container">
          <div className="block-buttons">
            <button
              title="Add Text Block"
              onClick={() => handleAddBlock("text")}
            >
              <FontAwesomeIcon icon={faComment} />{" "}
            </button>
            <button
              title="Add Open-Question Block"
              onClick={() => handleAddBlock("open")}
            >
              <FontAwesomeIcon icon={faQuestion} />{" "}
            </button>
            <button
              title="Add Multiple Choice Block"
              onClick={() => handleAddBlock("multiple")}
            >
              <FontAwesomeIcon icon={faSquareCheck} />{" "}
            </button>
            <button
              title="Add Single Choice Block"
              onClick={() => handleAddBlock("single")}
            >
              <FontAwesomeIcon icon={faCircleDot} />{" "}
            </button>
            <button
              title="Add Linear Scale Question Block"
              onClick={() => handleAddBlock("range")}
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            <button title="Add Image" onClick={() => handleAddBlock("image")}>
              <FontAwesomeIcon icon={faImage} />
            </button>
          </div>
        </div>
        {(isError || errorMessages) && (
          <span className="error__text error__text_header error__text_footer">
            Please check all fields
          </span>
        )}
        <div className="buttons-save-as-draft-and-publish-container">
          <button
            className="buttons-save-as-draft-and-publish"
            onClick={(e) => handleSubmit(e, false, true)}
          >
            Save as Draft
          </button>
          <button
            className="buttons-save-as-draft-and-publish"
            onClick={(e) => handleSubmit(e, false, false)}
            disabled={errorMessages || isError}
          >
            Complete & Publish
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewAssignment() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState();
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    text: "",
    type: "",
    language: "",
    image_url: "",
    author: "",
    blocks: [],
  });

  const setAssignmentCredentials = useCallback((data) => {
    const restoredBlocks = data.blocks
      ? data.blocks.map((block) => {
          if (block.description) {
            // Используем функцию парсинга для получения HTML-текста из JSON Draft.js
            const parsedContent = decodeStyledText(block.description);

            return {
              ...block,
              description: parsedContent,
            };
          }
          return block;
        })
      : [];

    setAssignmentData({
      ...data,
      blocks: restoredBlocks,
    });
  }, []);

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleDeleteAssignment = async () => {
    try {
      await API.delete(`assignments/${id}/`);
      navigate("/assignments");
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        const response = await API.get(`assignments/${id}/`);
        setAssignmentCredentials(response.data);
      } catch (error) {
        console.error("Error fetching assignment data", error);
        navigate("/assignments"); // Redirect if error
      }
    };

    fetchAssignmentData();
  }, [id, navigate, setAssignmentCredentials]);

  console.log("data", assignmentData);

  return (
    <div className="assignments-page">
      <header>
        <h1>{assignmentData.title}</h1>
        {currentUser.id === assignmentData.author && (
          <div>
            <button className="action-button" onClick={handleToggleModal}>
              Delete Assignment
            </button>
            <button
              className="action-button"
              onClick={() => navigate(`/edit-assignment/${id}`)}
            >
              Edit Assignment
            </button>
          </div>
        )}
      </header>
      <div className="assignment-view-body">
        <div className="assignment-details">
          <p>
            <strong>Description:</strong> {assignmentData.text}
          </p>
          <p>
            <strong>Author: </strong>
            {assignmentData.author_name}
          </p>
          <p>
            <strong>Type: </strong> {assignmentData.assignment_type}
          </p>
          <p>
            <strong>Language: </strong> {assignmentData.language}
          </p>
          <div className="assignment-blocks">
            {assignmentData.blocks.length > 0 &&
              assignmentData.blocks.map((block, index) => (
                <AssignmentBlock key={index} block={block} readOnly={true} />
              ))}
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={handleToggleModal}
        onConfirm={handleDeleteAssignment}
        confirmText="Delete forever"
      >
        <p>
          Are you sure you want to delete this assignment?{" "}
          <strong>This action is irrevertable!</strong>
        </p>
      </Modal>
    </div>
  );
}

export { AddAssignment, ViewAssignment };
