//@ts-nocheck
import React, { useState, useEffect } from "react";
import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../css/block.scss";
import HeadlinerImg from "../../components/psy/HeadlinerImg/HeadlinerImg";
import Block from "./Block/Block";
import bold from "../../images/assignment-page/type-bold.svg";
import italic from "../../images/assignment-page/type-italic.svg";
import underline from "../../images/assignment-page/type-underline.svg";

function AssignmentBlock({
  block,
  updateBlock,
  removeBlock,
  copyBlock,
  moveBlockForward,
  moveBlockBackward,
  index,
  readOnly,
  isView,
  setSelectedImageForBlock,
  setIsError,
}) {
  const [title, setTitle] = useState(block.title);
  const [choices, setChoices] = useState(block.choices || []);
  const [minValue, setMinValue] = useState(
    block.minValue !== undefined ? block.minValue : 1,
  );
  const [maxValue, setMaxValue] = useState(block.maxValue || 10);
  const [choiceRefs, setChoiceRefs] = useState([]);
  const [leftPole, setLeftPole] = useState(
    block.leftPole || block.left_pole || "",
  );
  const [rightPole, setRightPole] = useState(
    block.rightPole || block.right_pole || "",
  );
  const [image, setImage] = useState(block.image);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (choices && choices.length > 0) {
      const lastRef = choiceRefs[choices.length - 1];
      if (lastRef && lastRef.current) {
        lastRef.current.focus();
      }
    }
  }, [choices, choiceRefs]);

  useEffect(() => {
    if (choices) {
      setChoiceRefs(choices.map(() => React.createRef()));
    }
  }, [choices]);

  const validateChoices = () => {
    if (
      (block.type === "single" || block.type === "multiple") &&
      choices.length < 2
    ) {
      setIsError(true);
      setErrorText(
        `${errorText.includes(" Please enter at least two options") ? errorText.replace(" Please enter at least two options", "") : errorText} Please enter at least two options`,
      );
    } else {
      setIsError(false);
      setErrorText(errorText.replace(" Please enter at least two options", ""));
    }
  };

  if (readOnly) {
    return (
      <div className="block">
        <div className="block-header">
          {!block.description ? (
            <h3 className="block-title">
              {isView ? block.title : block.question}
            </h3>
          ) : (
            <div
              className="block__text"
              dangerouslySetInnerHTML={{ __html: block.description }}
            />
          )}
        </div>
        {block.type === "image" && (
          <img className="block-image" src={block.image} alt={block.question} />
        )}
        {(block.type === "single" || block.type === "multiple") && (
          <ul className={`choices-container ${block.type}`}>
            {isView == true &&
              block.choices.map((choice, index) => (
                <li key={index} className="choice-option">
                  {block.type === "single" ? (
                    <input type="radio" disabled />
                  ) : (
                    <input type="checkbox" disabled />
                  )}
                  <span className="choice-label">{choice.reply}</span>
                </li>
              ))}
            {block.choice_replies &&
              block.choice_replies.map((choice, index) => (
                <li key={index} className="choice-option">
                  {block.type === "single" ? (
                    <input type="radio" disabled />
                  ) : (
                    <input type="checkbox" disabled />
                  )}
                  <span className="choice-label">{choice.reply}</span>
                </li>
              ))}
          </ul>
        )}
        {block.type === "range" && (
          <div className="range-display">
            <span className="range-label">
              {block.left_pole || "Left Pole"}
            </span>
            <div className="range-options">
              {Array.from(
                { length: block.end_range - block.start_range + 1 },
                (_, i) => i + block.start_range,
              ).map((value) => (
                <label key={value} className="range-option">
                  <input
                    type="radio"
                    name={`range-${block.id}`}
                    value={value}
                    disabled
                  />
                  <span className="range-option-label">{value}</span>
                </label>
              ))}
            </div>
            <span className="range-label">
              {block.right_pole || "Right Pole"}
            </span>
          </div>
        )}
        {block.type === "open" && (
          <div className="open-container">
            <input placeholder="Write you answer here..." disabled />
            <div className="open-buttons">
              <button type="button">
                <img src={bold} />
              </button>
              <button type="button">
                <img src={italic} />
              </button>
              <button type="button">
                <img src={underline} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleTitleChange = useCallback(
    (event) => {
      setTitle(event.target.value);
      updateBlock(block.id, block.content, choices, event.target.value);
    },
    [block.id, block.content, choices, updateBlock],
  );

  const handleChoiceChange = useCallback(
    (index, event) => {
      const newChoices = [...choices];
      newChoices[index] = event.target.value;
      setChoices(newChoices);
      updateBlock(block.id, block.content, newChoices, title);
    },
    [block.id, block.content, choices, updateBlock],
  );

  const handleMinChange = useCallback(
    (change, e) => {
      e.preventDefault();
      let newValue = Math.max(0, minValue + change);
      // Добавляем проверку, чтобы ограничить максимальное значение
      newValue = Math.min(1, newValue);
      setMinValue(newValue);
      updateBlock(
        block.id,
        block.content,
        block.choices,
        title,
        newValue,
        maxValue,
      );
    },
    [block.id, block.content, choices, updateBlock],
  );

  const handleMaxChange = useCallback(
    (change, e) => {
      e.preventDefault();
      // Используем Math.min и Math.max для ограничения значения в диапазоне от 2 до 10
      const newValue = Math.min(Math.max(maxValue + change, 2), 10);
      setMaxValue(newValue);
      updateBlock(
        block.id,
        block.content,
        block.choices,
        title,
        minValue,
        newValue,
      );
    },
    [block.id, block.content, choices, updateBlock],
  );

  const handleNumberChange = useCallback(
    (event, type) => {
      let value = parseInt(event.target.value, 10);
      // Если тип ввода равен 'min', ограничиваем диапазон от 0 до 1
      if (type === "min") {
        if (isNaN(value) || value < 0) {
          value = 0;
        } else if (value > 1) {
          value = 1;
        }
      } else {
        if (isNaN(value) || value < 2) {
          value = 2;
        } else if (value > 10) {
          value = 10;
        }
      }

      if (type === "min") {
        setMinValue(value);
        updateBlock(
          block.id,
          block.content,
          block.choices,
          title,
          value,
          maxValue,
        );
      } else {
        setMaxValue(value);
        updateBlock(
          block.id,
          block.content,
          block.choices,
          title,
          minValue,
          value,
        );
      }
    },
    [block.id, block.content, choices, updateBlock],
  );

  const handlePoleChange = useCallback(
    (pole, value) => {
      if (pole === "left") {
        setLeftPole(value);
        updateBlock(
          block.id,
          block.content,
          block.choices,
          title,
          minValue,
          maxValue,
          value,
          rightPole,
        );
      } else {
        setRightPole(value);
        updateBlock(
          block.id,
          block.content,
          block.choices,
          title,
          minValue,
          maxValue,
          leftPole,
          value,
        );
      }
    },
    [block.id, block.content, choices, updateBlock],
  );

  const handleNewChoiceFocus = (event) => {
    if (event.target.value === "") {
      addChoice();
    }
  };

  const addChoice = useCallback(() => {
    if (choices.some((choice) => choice.trim() === "")) {
      // Не добавлять новый выбор, если есть пустой
      return;
    }

    const newChoiceRef = React.createRef();
    setChoiceRefs((refs) => [...refs, newChoiceRef]);
    setChoices((currentChoices) => {
      const updatedChoices = [...currentChoices, ""];
      updateBlock(block.id, block.content, updatedChoices, title);
      return updatedChoices;
    });
  }, [block.id, block.content, choices, updateBlock]);

  const removeChoice = useCallback(
    (index) => {
      const newChoices = choices.filter((_, i) => i !== index);
      setChoices(newChoices);
      updateBlock(block.id, block.content, newChoices, title);
    },
    [block.id, block.content, choices, updateBlock],
  );

  if (block.type === "text") {
    return (
      <Block
        block={block}
        removeBlock={removeBlock}
        copyBlock={copyBlock}
        heading="Text paragraph"
        question={title}
        updateBlock={updateBlock}
        handleTitleChange={handleTitleChange}
        placeholder="Write your text here..."
        moveBlockForward={moveBlockForward}
        moveBlockBackward={moveBlockBackward}
        index={index}
        errorText={errorText}
        setErrorText={setErrorText}
        setIsError={setIsError}
      ></Block>
    );
  }

  if (block.type === "open") {
    return (
      <Block
        block={block}
        removeBlock={removeBlock}
        copyBlock={copyBlock}
        heading="Open-ended question"
        question={title}
        updateBlock={updateBlock}
        handleTitleChange={handleTitleChange}
        placeholder="Write question here..."
        moveBlockForward={moveBlockForward}
        moveBlockBackward={moveBlockBackward}
        index={index}
        errorText={errorText}
        setErrorText={setErrorText}
        setIsError={setIsError}
      ></Block>
    );
  }

  if (block.type === "range") {
    return (
      <Block
        block={block}
        removeBlock={removeBlock}
        copyBlock={copyBlock}
        heading="Linear Scale"
        question={title}
        updateBlock={updateBlock}
        handleTitleChange={handleTitleChange}
        placeholder="Write question here..."
        moveBlockForward={moveBlockForward}
        moveBlockBackward={moveBlockBackward}
        index={index}
        errorText={errorText}
        setErrorText={setErrorText}
        setIsError={setIsError}
      >
        <div className="range-inputs">
          <input
            className="number-input-container"
            type="text"
            value={leftPole}
            onChange={(e) => handlePoleChange("left", e.target.value)}
            placeholder="Left pole..."
            maxLength={15}
          />
          <div className="number-input-container">
            <button
              className="number-input-container-button"
              onClick={(e) => handleMinChange(-1, e)}
            >
              ▼
            </button>
            <input
              className="number-input-container-input"
              type="number"
              value={minValue}
              onChange={(e) => handleNumberChange(e, "min")}
              min={0}
              max={1}
            />
            <button
              className="number-input-container-button"
              onClick={(e) => handleMinChange(1, e)}
            >
              ▲
            </button>
          </div>
          <p>-</p>
          <div className="number-input-container">
            <button
              className="number-input-container-button"
              onClick={(e) => handleMaxChange(-1, e)}
            >
              ▼
            </button>
            <input
              className="number-input-container-input"
              type="number"
              value={maxValue}
              onChange={(e) => handleNumberChange(e, "max")}
              min={2}
              max={10}
            />
            <button
              className="number-input-container-button"
              onClick={(e) => handleMaxChange(1, e)}
            >
              ▲
            </button>
          </div>
          <input
            className="number-input-container"
            type="text"
            value={rightPole}
            onChange={(e) => handlePoleChange("right", e.target.value)}
            placeholder="Right pole..."
            maxLength={15}
          />
        </div>
      </Block>
    );
  }

  if (block.type === "image") {
    return (
      <Block
        block={block}
        removeBlock={removeBlock}
        copyBlock={copyBlock}
        heading="Image"
        question={title}
        updateBlock={updateBlock}
        handleTitleChange={handleTitleChange}
        placeholder="HEADLINE"
        moveBlockForward={moveBlockForward}
        moveBlockBackward={moveBlockBackward}
        index={index}
        errorText={errorText}
        setErrorText={setErrorText}
        setIsError={setIsError}
      >
        <HeadlinerImg
          setSelectedImageForBlock={setSelectedImageForBlock}
          image={block.image}
          errorText={errorText}
          setErrorText={setErrorText}
          setIsError={setIsError}
          updateBlock={updateBlock}
          block={block}
        />
      </Block>
    );
  }

  return (
    <Block
      block={block}
      removeBlock={removeBlock}
      copyBlock={copyBlock}
      heading={block.type === "multiple" ? "Multiple-choice" : "Single-choice"}
      question={title}
      updateBlock={updateBlock}
      handleTitleChange={handleTitleChange}
      placeholder="Write question here..."
      moveBlockForward={moveBlockForward}
      moveBlockBackward={moveBlockBackward}
      index={index}
      errorText={errorText}
      setErrorText={setErrorText}
      setIsError={setIsError}
    >
      {choices.map((choice, index) => (
        <div key={index} className="choice-option">
          {block.type === "multiple" ? (
            <input
              type="checkbox"
              disabled
              className={`${errorText.includes("Please enter at least two options") ? "errorCheckboxRadio" : ""}`}
            />
          ) : (
            <input
              type="radio"
              disabled
              className={`${errorText.includes("Please enter at least two options") ? "errorCheckboxRadio" : ""}`}
            />
          )}
          <input
            ref={choiceRefs[index]}
            type="text"
            value={choice}
            onChange={(event) => handleChoiceChange(index, event)}
            placeholder={`Option ${index + 1}`}
            className="choice-input"
            onBlur={validateChoices}
          />
          <button
            type="button"
            onClick={() => removeChoice(index)}
            className="button"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      ))}
      <div className="choice-option">
        {block.type === "single" ? (
          <input
            type="radio"
            disabled
            style={{ opacity: 0.8 }}
            className={`${errorText.includes("Please enter at least two options") ? "errorCheckboxRadio" : ""}`}
          />
        ) : (
          <input
            type="checkbox"
            disabled
            style={{ opacity: 0.8 }}
            className={`${errorText.includes("Please enter at least two options") ? "errorCheckboxRadio" : ""}`}
          />
        )}
        <input
          type="text"
          value=""
          onFocus={handleNewChoiceFocus}
          placeholder="Add option..."
          style={{ opacity: 0.8 }}
          className="choice-input"
        />
      </div>
    </Block>
  );
}

export { AssignmentBlock };
