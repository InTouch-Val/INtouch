//@ts-nocheck
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../../service/authContext";
import save from "../../../images/save.svg";
import arrowLeft from "../../../images/arrow-left.svg";
import arrowBack from "../../../images/arrowBackWhite.svg";
import sadEmote from "../../../images/sadEmote.svg";
import smilyEmote from "../../../images/smilyEmote.svg";
import "../../../css/block.css";
import "../../../css/assignments.css";
import { ClientAssignmentBlocks } from "../../../service/ClientAssignmentBlocks";
import { API } from "../../../service/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import decodeStyledText from "../../../service/decodeStyledText";
import Modal from "../../modals/Modal/Modal";
import EntryNotComplete from "../../modals/Notifications/entryNotComplete";
import EntryUnsavedExit from "../../modals/Notifications/entryUnsavedExit";
import useMobileWidth from "../../../utils/hook/useMobileWidth";
import { ContentState, convertFromRaw, getPlainText } from "draft-js";

function CompleteAssignments() {
  const location = useLocation();
  const pathParts = location.pathname.split("/");

  // Проверяем, соответствует ли путь шаблону /clients/{id}/assignments/{id}
  const isClientsAssignmentsPath =
    pathParts.length === 5 &&
    pathParts[1] === "clients" &&
    pathParts[3] === "assignments";

  const [modalExitIsOpen, setModalExitOpen] = useState(false);

  const [assignmentData, setAssignmentData] = useState({
    title: "",
    text: "",
    type: "",
    language: "",
    image_url: "",
    author: "",
    blocks: [],
  });

  const [isRateTask, setIsRateTask] = useState(false);
  const { setCurrentCard, card } = useAuth();
  const [values, setValues] = useState({});
  const [blocks, setBlocks] = useState([]);
  const [textareaValue, setTextareaValue] = useState(""); // State to hold the textarea value

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value); // Updates the state when textarea changes
  };

  const setAssignmentCredentials = useCallback((data) => {
    const restoredBlocks = data.blocks
      ? data.blocks.map((block) => {
          if (block.description) {
            // Используем функцию парсинга для получения HTML-текста из JSON Draft.js
            const parsedContent = decodeStyledText(block.description);

            return {
              ...block,
              initialDescription: block.description,
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

  useEffect(() => {
    setAssignmentCredentials(card);
    setInitialData(false);
    setIsSaved(false);
  }, []);

  useEffect(() => {
    setBlocks(assignmentData.blocks);
  }, [assignmentData]);

  //tracks if there are any changes in inputs
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    setInitialData(blocks);
  }, [blocks]);

  const checkIfChangesMade = () => {
    // Here we compare deep equality of current data and initial data
    return (
      JSON.stringify(assignmentData.blocks) !== JSON.stringify(initialData)
    );
  };

  //track if the user has saved assignment changes
  const [isSaved, setIsSaved] = useState(false);

  const goBack = () => {
    if (!isClientsAssignmentsPath) {
      if (checkIfChangesMade()) {
        if (isSaved) {
          // Changes were made and saved
          navigate(-1);
          setShowInvalidInputs(false);
          setInitialData(null);
          setModalExitOpen(false);
        } else {
          // Changes were made and NOT saved
          setModalExitOpen(true);
        }
      } else {
        navigate(-1); // NO changes made, safe to navigate back
        setInitialData(null);
        setShowInvalidInputs(false);
      }
    } else {
      navigate(-1); //if user is psy just navigate back
    }
  };

  const [inputValidationStates, setInputValidationStates] = useState({
    openInputs: {},
    multipleInputs: {},
    singleInputs: {},
    rangeInputs: {},
  });

  const [allInputsFilled, setAllInputsFilled] = useState(false);

  useEffect(() => {
    if (isClientsAssignmentsPath) {
      return;
    }
    let newState = {
      openInputs: {},
      multipleInputs: {},
      singleInputs: {},
      rangeInputs: {},
    };

    let allFilled = true;

    const getPlainTextFromReply = (reply) => {
      try {
        const contentState = convertFromRaw(JSON.parse(reply));
        return contentState.getPlainText();
      } catch (error) {
        console.error("Error parsing block.reply:", error);
        return "";
      }
    };

    // Checks 'open' type blocks
    const openReplies = blocks.filter((block) => block.type === "open");
    openReplies.forEach((block) => {
      const plainText = getPlainTextFromReply(block.reply);
      newState.openInputs[block.id] = plainText.trim() !== "";
      if (plainText.trim() === "") {
        allFilled = false;
      }
    });

    // Checks 'multiple' type blocks
    const multipleChoices = blocks.filter((block) => block.type === "multiple");
    if (
      multipleChoices.some(
        (block) => !block.choice_replies.some((option) => option.checked),
      )
    ) {
      allFilled = false;
    }
    multipleChoices?.forEach((block) => {
      newState.multipleInputs[block.id] = block.choice_replies.some(
        (option) => option.checked,
      );
    });

    // Checks 'single' type blocks
    const singleChoices = blocks.filter((block) => block.type === "single");
    if (
      singleChoices.some(
        (block) => !block.choice_replies.some((option) => option.checked),
      )
    ) {
      allFilled = false;
    }
    singleChoices?.forEach((block) => {
      newState.singleInputs[block.id] = block.choice_replies.some(
        (option) => option.checked,
      );
    });

    // Checks 'range' type blocks
    const rangeChoices = blocks.filter((block) => block.type === "range");
    if (
      rangeChoices.some(
        (block) => block.reply === undefined || block.reply.trim() === "",
      )
    ) {
      allFilled = false;
    }
    rangeChoices?.forEach((block) => {
      newState.rangeInputs[block.id] =
        block.reply !== undefined && block.reply.trim() !== "";
    });

    setInputValidationStates(newState);
    setAllInputsFilled(allFilled);
  }, [blocks]);

  const [showInvalidInputs, setShowInvalidInputs] = useState(false);

  const updateBlock = (blockId, newReply, newChoices) => {
    const updatedBlocks = blocks.map((block) => {
      if (block.id === blockId) {
        return {
          ...block,
          reply: newReply ?? block.reply,
          choice_replies: newChoices || block.choice_replies,
        };
      }
      return block;
    });
    setBlocks(updatedBlocks);
  };

  function handleValues(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    console.log(event.target);
  }

  const [valueOfRate, setValueOfRate] = useState(null);

  const handleRadioChange = (event) => {
    setValueOfRate(parseInt(event.target.value));
  };

  const [modalIsOpen, setModalOpen] = useState(false);

  function handleRateTaskBtnClick() {
    if (allInputsFilled) {
      setIsRateTask(!isRateTask);
      setShowInvalidInputs(false);
    } else {
      setModalOpen(true);
      setShowInvalidInputs(true);
    }
  }

  async function handleShareWithTherapist() {
    try {
      const res = await API.post(
        `assignments-client/${assignmentData.id}/visible/`,
      );
      if (res.status >= 200 && res.status < 300) {
        console.log(res.data);
      } else {
        console.log(`Status: ${res.status}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const navigate = useNavigate(); // Получите доступ к history

  function transformBlock(block) {
    if (block.type === "text" || block.type === "open") {
      return {
        type: block.type,
        description: block.initialDescription,
        reply: block.reply,
      };
    }
    if (block.type === "range") {
      return {
        type: block.type,
        reply: block.reply,
      };
    }
    if (block.type === "image") {
      return {
        type: block.type,
      };
    }
    return {
      type: block.type,
      choice_replies: block.choice_replies,
    };
  }

  async function handleDoneWithReview() {
    //sends complete task WITH rate
    const blockInfo = blocks.map(transformBlock);

    try {
      const res = await API.patch(`assignments-client/${assignmentData.id}/`, {
        grade: parseInt(valueOfRate, 10),
        review: document.getElementById("text").value, // Получаем значение из textarea
        blocks: blockInfo,
      });
      if (res.status >= 200 && res.status < 300) {
        console.log(res.data);
        const resComplete = await API.patch(
          `assignments-client/${assignmentData.id}/complete/`,
        );
        if (resComplete.status >= 200 && resComplete.status < 300) {
          navigate("/my-assignments");
        } else {
          console.log(`Status: ${resComplete.status}`);
        }
      } else {
        console.log(`Status: ${res.status}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handleSaveTask() {
    //saves changes in task
    const blockInfo = blocks.map(transformBlock);
    try {
      const res = await API.patch(`assignments-client/${assignmentData.id}/`, {
        blocks: blockInfo,
      });
      if (res.status >= 200 && res.status < 300) {
        setIsSaved(true);
      } else {
        console.log(`Status: ${res.status}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handleCompleteTask() {
    //sends complete task without rate
    const blockInfo = blocks.map(transformBlock);

    try {
      console.log(blockInfo);
      const res = await API.patch(`assignments-client/${assignmentData.id}/`, {
        blocks: blockInfo,
      });
      if (res.status >= 200 && res.status < 300) {
        console.log(res.data);
        const resComplete = await API.patch(
          `assignments-client/${assignmentData.id}/complete/`,
        );
        if (resComplete.status >= 200 && resComplete.status < 300) {
          navigate("/my-assignments");
        } else {
          console.log(`Status: ${resComplete.status}`);
        }
      } else {
        console.log(`Status: ${res.status}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const isMobileWidth = useMobileWidth();

  return isRateTask ? (
    <>
      {isMobileWidth ? (
        <button
          onClick={() => {
            setIsRateTask(!isRateTask);
            setModalOpen(false);
          }}
          className="button__type_back button-back-mobile"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ color: "#417D88" }}
            size="xl"
          />
        </button>
      ) : null}

      <h1
        className="assignment__name assignment__name--rate"
        style={{ textAlign: "center" }}
      >
        How helpful was the task?
      </h1>
      <div className="rating_section">
        <div className="rating-container">
          {isMobileWidth ? null : (
            <img src={sadEmote} alt="Грустный смайлик" className="smiley" />
          )}

          {Array.from({ length: 10 }, (_, index) => index + 1).map((num) => (
            <label key={num} className="radio-label">
              <div className="mood-number">{num}</div>
              <input
                type="radio"
                name="mood"
                value={num}
                checked={valueOfRate === num}
                onChange={handleRadioChange}
                className="radio"
              />
              <div
                className={`mood-display ${valueOfRate === num ? "emoteActive" : valueOfRate === num ? "active" : ""}`}
              ></div>
            </label>
          ))}
          {isMobileWidth ? null : (
            <img src={smilyEmote} alt="Весёлый смайлик" className="smiley" />
          )}
        </div>
        <div className="rating_values_container">
          <span>Dissatisfied</span>
          <span>Satisfied</span>
        </div>
      </div>
      <div className="rateTask__comment-container">
        <label className="rateTask__comment-label" htmlFor="text">
          You can share your feedback with your therapist after completing this
          task:
        </label>
        <textarea
          className="rateTask__comment-input"
          type="text"
          name="text"
          id="text"
          placeholder="Add some notes here..."
          onChange={handleTextareaChange}
        />
      </div>
      <div className="assignment__buttons-box">
        {isMobileWidth ? null : (
          <button
            onClick={() => {
              setIsRateTask(!isRateTask);
              setModalOpen(false);
            }}
            className="button__type_back button__type_back_greenWhite"
          >
            <img src={arrowBack} />
          </button>
        )}

        {isMobileWidth ? (
          <>
            <button
              onClick={handleDoneWithReview}
              className="button__type_back button__type_back_greenWhite button_done"
              disabled={valueOfRate === null && textareaValue.trim() === ""} //disabled when no rate is selected and no comment is written
            >
              Done
            </button>

            <button
              onClick={handleCompleteTask}
              className="button__type_back button__type_skip"
            >
              Skip
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleCompleteTask}
              className="button__type_back button__type_skip"
            >
              Skip
            </button>

            <button
              onClick={handleDoneWithReview}
              className="button__type_back button__type_back_greenWhite button_done"
              disabled={valueOfRate === null} //disabled when no rate is selected
            >
              Done
            </button>
          </>
        )}
      </div>
    </>
  ) : (
    <>
      <div className="assignment-header">
        <div className="assignment__container_button">
          <button className="button__type_back" onClick={goBack}>
            {isMobileWidth ? (
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ color: "#417D88" }}
                size="xl"
              />
            ) : (
              <img src={arrowLeft} />
            )}
          </button>

          {!isClientsAssignmentsPath && (
            <button className="button__type_save" onClick={handleSaveTask}>
              {isMobileWidth ? (
                <FontAwesomeIcon
                  icon={faFloppyDisk}
                  style={{ color: "#417D88" }}
                  size="2xl"
                />
              ) : (
                <img src={save} />
              )}
            </button>
          )}
        </div>
        <h1 className="assignment__name">{assignmentData.title}</h1>
        <p className="assignment__progress">{assignmentData.status}</p>
      </div>
      {assignmentData.image_url ? (
        <img className="assignment__image" src={assignmentData.image_url}></img>
      ) : (
        ""
      )}

      <p className="aassignment__paragraph">{assignmentData.text}</p>
      {isClientsAssignmentsPath &&
        (assignmentData.review || assignmentData.grade) && (
          <>
            <h1 className="assignment__name" style={{ textAlign: "center" }}>
              Client`s Rating:
            </h1>
            <div className="rating-container">
              {Array.from({ length: 11 }, (_, index) => index).map((num) => (
                <label key={num} className="radio-label">
                  {num !== 0 && num !== 10 && (
                    <div className="mood-number">{num}</div>
                  )}
                  <input
                    type="radio"
                    name="mood"
                    value={num}
                    checked={assignmentData.grade === num}
                    onChange={handleRadioChange}
                    className="radio"
                    disabled
                  />
                  <div
                    className={`mood-display ${assignmentData.grade === num && (num === 0 || num === 10) ? "emoteActive" : assignmentData.grade === num ? "active" : ""}`}
                    style={
                      num === 0 || num === 10
                        ? { border: "none" }
                        : { display: "flex" }
                    }
                  >
                    {num === 0 ? (
                      <img
                        src={sadEmote}
                        alt="Грустный смайлик"
                        className={`smiley ${assignmentData.grade === num ? "active" : ""}`}
                      />
                    ) : (
                      ""
                    )}
                    {num === 10 ? (
                      <img
                        src={smilyEmote}
                        alt="Весёлый смайлик"
                        className={`smiley ${assignmentData.grade === num ? "active" : ""}`}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </label>
              ))}
            </div>

            <div className="rateTask__comment-container">
              <label className="rateTask__comment-label" htmlFor="text">
                Feedback from client:
              </label>
              <textarea
                className="rateTask__comment-input"
                type="text"
                name="text"
                id="text"
                placeholder="Add some notes here..."
                value={assignmentData.review || "Client doesn`t send feedback"}
                disabled
              />
            </div>
            <h1
              className="assignment__name"
              style={{ textAlign: "center", margin: "50px 0" }}
            >
              Completed Assignment:
            </h1>
          </>
        )}

      <div className="assignment-blocks">
        {blocks.length > 0 &&
          blocks.map((block, index) => (
            <ClientAssignmentBlocks
              key={index}
              block={block}
              handleClick={handleValues}
              updateBlock={updateBlock}
              isView={isClientsAssignmentsPath}
              inputValidationStates={inputValidationStates}
              showInvalidInputs={showInvalidInputs}
            />
          ))}
      </div>
      {!isClientsAssignmentsPath && (
        <div className="assignment__share-container">
          <label className="card__input-label assignment__share-label">
            Share with my therapist
            <input
              type="checkbox"
              className="card__input-checkbox  assignment__share-checkbox"
              defaultChecked={assignmentData?.visible}
              onClick={() => handleShareWithTherapist()}
            />
          </label>
        </div>
      )}
      <div className="assignment__buttons-box">
        {!isClientsAssignmentsPath && (
          <>
            <button
              onClick={handleRateTaskBtnClick}
              className="action-button assignment__button"
            >
              Complete Task
            </button>
          </>
        )}
      </div>

      {modalIsOpen ? (
        <Modal>
          <EntryNotComplete
            completeClick={() => setIsRateTask(!isRateTask)}
            backClick={() => setModalOpen(false)}
          />
        </Modal>
      ) : null}

      {modalExitIsOpen ? (
        <Modal>
          <EntryUnsavedExit
            saveClick={async () => {
              try {
                await handleSaveTask();
                navigate(-1);
              } catch (error) {
                console.error("Failed to save:", error);
              }
            }}
            discardClick={() => navigate(-1)}
          />
        </Modal>
      ) : null}
    </>
  );
}

export { CompleteAssignments };
