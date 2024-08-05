//@ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorState, ContentState } from "draft-js";
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
import imageIcon from "../../images/assignment-page/image.svg";
import textParagraphIcon from "../../images/assignment-page/paragraph.svg";
import linearScaleIcon from "../../images/assignment-page/linear-scale.svg";
import multipleIcon from "../../images/assignment-page/multiple-choice.svg";
import questionIcon from "../../images/assignment-page/question.svg";
import singleIcon from "../../images/assignment-page/single-choice.svg";

const getObjectFromEditorState = (editorState) => JSON.stringify(editorState);

function AddAssignment() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [language, setLanguage] = useState("");
  // const [tags, setTags] = useState('');

  const [blocks, setBlocks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");
  const [selectedImageForBlock, setSelectedImageForBlock] = useState({
    file: null, // Файл изображения
    url: null, // URL изображения, полученный с помощью FileReader
  });

  const [isChangeView, setChangeView] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    console.log(title, description);
    if (title.length > 2 && description.length > 2) {
      setErrorText("");

      const titleElement = document.getElementById("title");

      const textElement = document.getElementById("text");
      titleElement.classList.remove("error");
      textElement.classList.remove("error");
    }
  }, [title, description]);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id != undefined;

  const fetchAssignment = useCallback(async () => {
    try {
      const response = await API.get(`assignments/${id}/`);
      setTitle(response.data.title);
      setDescription(response.data.text);
      setType(response.data.assignment_type);
      setLanguage(response.data.language);
      setSelectedImage({ urls: { full: response.data.image_url } });

      const fetchedBlocks = response.data.blocks.map((block) => {
        let contentState;
        try {
          contentState = ContentState.createFromText(block.question);
        } catch (error) {
          console.error("Ошибка при обработке содержимого:", error);
          // Создаем ContentState с текстом из data.title для всех типов блоков, кроме 'text'
          if (block.type !== "text") {
            contentState = ContentState.createFromText(block.question);
          } else {
            // Для типа 'text' создаем пустое содержимое, если описание не может быть обработано
            contentState = ContentState.createFromText(block.question);
          }
        }

        if (block.type === "text") {
          return {
            ...block,
            content: EditorState.createWithContent(contentState),
          };
        }
        if (block.type === "single" || block.type === "multiple") {
          return {
            ...block,
            choices: block.choice_replies.map((choice) => choice.reply),
            content: EditorState.createWithContent(contentState),
          };
        }
        if (block.type === "range") {
          return {
            ...block,
            minValue: block.start_range,
            maxValue: block.end_range,
            content: EditorState.createWithContent(contentState),
          };
        }
        if (block.type === "image") {
          return {
            ...block,
            content: EditorState.createWithContent(contentState),
            image: block.image,
          };
        }
        return block;
      });

      setBlocks(fetchedBlocks);
    } catch (error) {
      console.error(error.message);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) {
      fetchAssignment();
    }
  }, [isEditMode, fetchAssignment]);

  useEffect(() => {
    console.log(blocks);
  }, [blocks]);

  function parseErrorText(errorText) {
    const errors = JSON.parse(errorText);
    const errorMessages = {};
    console.log(errors);

    errors.title?.forEach((message) => {
      errorMessages.title = message;
    });

    errors.text?.forEach((message) => {
      errorMessages.description = message;
    });

    errors.blocks?.forEach((block, index) => {
      if (block.image) {
        errorMessages[`blocks #${index + 1} image`] = block.image[0];
      }
      if (block.description) {
        errorMessages[`blocks #${index + 1} description`] =
          block.description[0];
      }
      if (block.question) {
        errorMessages[`blocks #${index + 1} question`] = block.question[0];
      }
      if (block.choice_replies) {
        errorMessages[`blocks #${index + 1} choice_replies`] =
          block.choice_replies[0];
      }
      if (block.end_range) {
        errorMessages[`blocks #${index + 1} end_range`] = block.end_range[0];
      }
      if (block.left_pole) {
        errorMessages[`blocks #${index + 1} left_pole`] = block.left_pole[0];
      }
      if (block.right_pole) {
        errorMessages[`blocks #${index + 1} right_pole`] = block.right_pole[0];
      }
      if (block.start_range) {
        errorMessages[`blocks #${index + 1} start_range`] =
          block.start_range[0];
      }
    });
    setHasScrolled(true);

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

    const requestData = {
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
      console.log(blockInfo);
      let response;
      if (!isEditMode) {
        // Если задание создается впервые, выполняем POST запрос
        response = await API.post("assignments/", requestData);
        if (!response || !response.data || !response.data.id) {
          throw new Error("Failed to create assignment");
        }
        // Получаем ID созданного задания
        const assignmentId = response.data.id;

        if (isDraft || isSaveAsDraft) {
          // Если задание должно быть сохранено как черновик, выполняем GET запрос
          await API.get(`assignments/${assignmentId}/draft/`);
        }
      } else {
        // Если задание уже существует, выполняем PUT запрос
        response = await API.patch(`assignments/${id}/`, requestData);
        if (isDraft || isSaveAsDraft) {
          // Если задание должно быть перемещено в черновик, выполняем GET запрос
          await API.get(`assignments/${id}/draft/`);
        }
      }

      if ([200, 201].includes(response.status)) {
        if (isDraft) {
          setSuccessMessageText("Saved succesfully");
          setSuccessMessage(true);
        } else if (isSaveAsDraft) {
          setTimeout(() => {
            navigate("/assignments");
          }, 2000);

          setSuccessMessageText("Draft created succesfully");
          setSuccessMessage(true);
        } else {
          setTimeout(() => {
            navigate("/assignments");
          }, 2000);

          setSuccessMessageText("Assignment created succesfully");
          setSuccessMessage(true);
        }
      }
    } catch (error) {
      const parsedError = parseErrorText(error.request.responseText);
      console.log(parsedError);
      // Преобразование объекта ошибок в строку для обновления состояния
      const errorTextString = Object.entries(parsedError)
        .map(([key, message]) => `${key}: ${message}`)
        .join(", ");
      setErrorText(`Please correct the following errors: ${errorTextString}`);
      console.error("Error creating assignment", error);
      displayErrorMessages(parsedError);
    }
  };

  const [errorText, setErrorText] = useState("");
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const targetElement = document.getElementById("errorText");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
    setHasScrolled(false);
  }, [hasScrolled]);

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
        key.startsWith(blockErrorKey),
      );
      if (blockErrorExists) {
        blockContainer.classList.add("error");
      }
    });
  }

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const addBlock = (type) => {
    const newBlock = {
      id: blocks.length + 1,
      type,
      title: "",
      content: EditorState.createEmpty(),
      choices: type === "text" || "open" ? [] : [""],
      minValue: type === "range" ? 1 : null,
      maxValue: type === "range" ? 10 : null,
      image: type === "image" ? "" : null,
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (blockId) => {
    const updatedBlocks = blocks.filter((block) => block.id !== blockId);
    setBlocks(updatedBlocks);
    setIsError(false);
  };

  const copyBlock = (block) => {
    const maxId = Math.max(...blocks.map((b) => b.id));
    const newBlock = { ...block, id: maxId + 1 };

    const index = blocks.findIndex((b) => b.id === block.id);

    blocks.splice(index + 1, 0, newBlock);

    setBlocks([...blocks]);
  };

  const moveBlockForward = (index) => {
    // Проверяем, не является ли текущий блок последним в массиве
    if (index < blocks.length - 1) {
      // Сохраняем текущий блок
      const block = blocks[index];
      // Удаляем блок из текущей позиции
      blocks.splice(index, 1);
      // Добавляем блок обратно в массив, но на позицию на одну вперед
      blocks.splice(index + 1, 0, block);
      // Обновляем состояние
      setBlocks([...blocks]);
    }
  };

  const moveBlockBackward = (index) => {
    // Проверяем, не является ли текущий блок первым в массиве
    if (index > 0) {
      // Сохраняем текущий блок
      const block = blocks[index];
      // Удаляем блок из текущей позиции
      blocks.splice(index, 1);
      // Добавляем блок обратно в массив, но на позицию на одну назад
      blocks.splice(index - 1, 0, block);
      // Обновляем состояние
      setBlocks([...blocks]);
    }
  };

  const updateBlock = (
    blockId,
    newContent,
    newChoices,
    newTitle,
    newMinValue,
    newMaxValue,
    newLeftPole,
    newRightPole,
    newImage,
  ) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              content: newContent || block.content,
              description:
                getObjectFromEditorState(newContent) || block.description,
              choices: newChoices || block.choices,
              title: newTitle || block.title,
              choice_replies:
                newChoices?.map((choice) => ({
                  reply: choice,
                  checked: false,
                })) || block.choice_replies,
              minValue: newMinValue ?? block.minValue,
              maxValue: newMaxValue ?? block.maxValue,
              leftPole: newLeftPole ?? block.leftPole,
              rightPole: newRightPole ?? block.rightPole,
              image: newImage ?? block.image,
            }
          : block,
      ),
    );
  };

  console.log(blocks);

  return (
    <div className="assignments-page">
      {successMessage && (
        <div className="success-message">{successMessageText}</div>
      )}
      <HeaderAssignment
        blocks={blocks}
        handleSubmit={(e) => handleSubmit(e, true, false)}
        errorText={errorText}
        isError={isError}
        changeView={() => {
          setChangeView((prev) => !prev);
        }}
      />
      <div className="form-title">
        <label>Enter Assignment Details</label>
        <input
          type="text"
          className="title-input"
          placeholder="Write the name of assignment here..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          id="title"
        />
        <input
          type="text"
          className="title-input"
          placeholder="White the description here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
                <Headline block={block} updateBlock={updateBlock} />
              )}
              {block.type === "imageQuestion" && (
                <ImageQuestionBlock block={block} updateBlock={updateBlock} />
              )}
              {block.type === "headlinerImg" && (
                <HeadlinerImg
                  block={block}
                  updateBlock={updateBlock}
                  setSelectedImageForBlock={setSelectedImageForBlock}
                />
              )}
            </div>
          ))}
          <div className="form-settings">
            <div className="form-setting">
              <label>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option hidden disabled value={""} selected>
                  Type
                </option>
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
                required
              >
                <option hidden disabled value={""} selected>
                  Language
                </option>
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
                  updateBlock={updateBlock}
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
                  updateBlock={updateBlock}
                  removeBlock={removeBlock}
                  copyBlock={copyBlock}
                  moveBlockForward={moveBlockForward}
                  moveBlockBackward={moveBlockBackward}
                  index={index}
                  setSelectedImageForBlock={setSelectedImageForBlock}
                  setIsError={setIsError}
                />
              ))}
            </>
          )}
        </form>
        <div className="block-buttons-container">
          <div className="block-buttons">
            <button
              title="Add Open-Question Block"
              onClick={() => addBlock("open")}
            >
              <img src={questionIcon} alt="OpenQuestionIcon" />
            </button>
            <button title="Add Text Block" onClick={() => addBlock("text")}>
              <img src={textParagraphIcon} alt="textParagraphIcon" />
            </button>
            <button
              title="Add Single Choice Block"
              onClick={() => addBlock("single")}
            >
              <img src={singleIcon} alt="singleChoiceIcon" />
            </button>
            <button
              title="Add Multiple Choice Block"
              onClick={() => addBlock("multiple")}
            >
              <img src={multipleIcon} alt="multipleChoiceIcon" />
            </button>
            <button
              title="Add Linear Scale Question Block"
              onClick={() => addBlock("range")}
            >
              <img src={linearScaleIcon} alt="linearScaleIcon" />
            </button>
            <button title="Add Image" onClick={() => addBlock("image")}>
              <img src={imageIcon} alt="imageIcon" />
            </button>
          </div>
        </div>
        {(isError || errorText) && (
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
            disabled={errorText || isError}
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
