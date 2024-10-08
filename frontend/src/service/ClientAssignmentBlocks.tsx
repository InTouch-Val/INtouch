//@ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from "react";
import { EditorToolbar } from "./editors-toolbar";
import { ToolbarProvider } from "./ToolbarContext";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
  newEditorState,
} from "draft-js";
import "../css/block.scss";
import "../css/assignments.scss";
import decodeStyledText from "./decodeStyledText";
import "../components/client/CompleteAssignments/CompleteAssignments.scss";
import useMobileWidth from "../utils/hook/useMobileWidth";

const getObjectFromEditorState = (editorState) => JSON.stringify(editorState);

function ClientAssignmentBlocks({
  block,
  handleClick,
  updateBlock,
  isView,
  inputValidationStates,
  showInvalidInputs,
  isViewPsy,
  isChangeView,
}) {
  const [choices, setChoices] = useState(block.choices || []);
  const [choiceRefs, setChoiceRefs] = useState([]);
  const editorRef = useRef(null);

  const [editorState, setEditorState] = useState(() => {
    try {
      if (isViewPsy || isView) {
        return EditorState.createEmpty();
      } else if (block.content) {
        const content =
          typeof block.content === "string"
            ? JSON.parse(block.content)
            : block.content;
        const contentState = convertFromRaw(content);
        return EditorState.createWithContent(contentState);
      }
      return EditorState.createEmpty();
    } catch (error) {
      console.error("Error creating EditorState:", error);
      return EditorState.createEmpty();
    }
  });

  const MAX_INPUT_LENGTH = 1000;

  // const handleEditorChange = useCallback(
  //   (newEditorState: { getCurrentContent: () => any }) => {
  //     if (isViewPsy || isView) {
  //       setEditorState(newEditorState);
  //       // Конвертируем editorState в строку и обновляем title
  //       const contentState = newEditorState.getCurrentContent();
  //       const text = contentState.getPlainText();
  //       updateBlock(block.id, contentState, block.choices, text);
  //     } else {
  //       const contentState = newEditorState.getCurrentContent();
  //       const inputText = contentState.getPlainText();

  //       if (inputText.length > MAX_INPUT_LENGTH) {
  //         const truncatedText = inputText.slice(0, MAX_INPUT_LENGTH);
  //         const newContentState = ContentState.createFromText(truncatedText);
  //         const truncatedEditorState =
  //           EditorState.createWithContent(newContentState);

  //         const rawContent = convertToRaw(newContentState);
  //         const serializedData = JSON.stringify(rawContent);
  //         setEditorState(truncatedEditorState);
  //         updateBlock(block.id, serializedData, []);
  //       }
  //       else {
  //         const rawContent = convertToRaw(contentState);
  //         const serializedData = JSON.stringify(rawContent);
  //         setEditorState(newEditorState);
  //         updateBlock(block.id, serializedData, []);
  //       }
  //     }
  //   },

  //   [updateBlock, block.id, block.content, block.choices],
  // );

  const handleEditorChange = useCallback(
    (newEditorState) => {
      const contentState = newEditorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      const serializedData = JSON.stringify(rawContent);

      const plainText = contentState.getPlainText();
      if (plainText.length <= MAX_INPUT_LENGTH) {
        setEditorState(newEditorState);
        updateBlock(block.id, serializedData, []);
      } else {
        const truncatedText = plainText.slice(0, MAX_INPUT_LENGTH);
        const newContentState = ContentState.createFromText(truncatedText);
        const truncatedEditorState =
          EditorState.createWithContent(newContentState);
        setEditorState(truncatedEditorState);
        const truncatedRawContent = convertToRaw(newContentState);
        const truncatedSerializedData = JSON.stringify(truncatedRawContent);
        updateBlock(block.id, truncatedSerializedData, []);
      }
    },
    [updateBlock, block.id],
  );

  const handleBeforeInput = useCallback(
    (chars, editorState) => {
      const currentContent = editorState.getCurrentContent();
      const currentText = currentContent.getPlainText();

      if (currentText.length >= MAX_INPUT_LENGTH) {
        return "handled";
      }
      return "not-handled";
    },
    [MAX_INPUT_LENGTH],
  );

  const handlePastedText = useCallback(
    (pastedText, html, newEditorState) => {
      const currentContent = newEditorState.getCurrentContent();
      const currentText = currentContent.getPlainText();

      if (currentText.length + pastedText.length > MAX_INPUT_LENGTH) {
        const allowedText = pastedText.slice(
          0,
          MAX_INPUT_LENGTH - currentText.length,
        );
        const newContentState = ContentState.createFromText(
          currentText + allowedText,
        );
        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          "insert-characters",
        );
        setEditorState(newEditorState);
        return "handled";
      }
      return "not-handled";
    },
    [editorState, MAX_INPUT_LENGTH],
  );

  const interceptSetEditorState = () => {
    console.log("e");
  };

  const isValid = () => {
    if (!isViewPsy && !isView) {
      return (
        inputValidationStates[block.type + "Inputs"] &&
        inputValidationStates[block.type + "Inputs"][block.id]
      );
    }
  };

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

  function handleRangeClick(event) {
    updateBlock(block.id, event.target.value, []);
  }

  const isMobileWidth = useMobileWidth();

  function handleSingleMultipleClick(event) {
    // Создаём новый массив newChoices, обновляя соответствующий элемент
    const newChoices = block.choice_replies.map((choice) => {
      // Если id текущего элемента совпадает с id целевого элемента
      if (choice.id.toString() === event.target.id) {
        // Возвращаем обновлённый элемент
        return {
          id: choice.id,
          reply: event.target.value,
          checked: event.target.checked,
        };
      } else if (event.target.type === "radio") {
        return {
          id: choice.id,
          reply: choice.reply,
          checked: false,
        };
      }
      return choice;
    });
    updateBlock(block.id, "", newChoices);
  }

  if (block.type === "text") {
    return (
      <div className="block assignment__block">
        {!block.description && !isViewPsy ? (
          <h3 className="assignment__block-header">{block.question}</h3>
        ) : (
          <div
            className="block__text"
            dangerouslySetInnerHTML={{
              __html: block.description
                ? !isViewPsy
                  ? block.description
                  : decodeStyledText(block.description)
                : decodeStyledText(getObjectFromEditorState(block.content)),
            }}
          />
        )}
      </div>
    );
  }

  if (block.type === "open") {
    return (
      <div
        className={`block assignment__block ${!isValid() && showInvalidInputs ? "uncompleted" : ""}`}
      >
        <div>
          {!block.description && !isViewPsy ? (
            <h3 className="assignment__block-header">{block.question}</h3>
          ) : (
            <>
              <div
                className="block__text"
                dangerouslySetInnerHTML={{
                  __html: block.description
                    ? !isViewPsy
                      ? block.description
                      : decodeStyledText(block.description)
                    : decodeStyledText(getObjectFromEditorState(block.content)),
                }}
              />
            </>
          )}
          <ToolbarProvider>
            <EditorToolbar
              editorState={editorState}
              ref={editorRef}
              onChange={isViewPsy || isView ? null : handleEditorChange}
              placeholder="Write your answer here..."
              readOnly={isView || isViewPsy}
              block={block}
              setEditorState={
                !isViewPsy || !isView
                  ? handleEditorChange
                  : interceptSetEditorState
              }
              isMobileWidth={isMobileWidth}
              handleBeforeInput={handleBeforeInput}
              handlePastedText={handlePastedText}
            />
          </ToolbarProvider>
        </div>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div className="block assignment__block">
        {!block.description && !isViewPsy ? (
          <h3 className="assignment__block-header">{block.question}</h3>
        ) : (
          <div
            className="block__text"
            dangerouslySetInnerHTML={{
              __html: block.description
                ? !isViewPsy
                  ? block.description
                  : decodeStyledText(block.description)
                : decodeStyledText(getObjectFromEditorState(block.content)),
            }}
          />
        )}
        <img className="block-image" src={block.image} alt={block.question} />
      </div>
    );
  }

  if (isChangeView && block.type === "range") {
    return (
      <div
        className={`block assignment__block ${!isValid() && showInvalidInputs ? "uncompleted" : ""}`}
      >
        <div>
          {!block.description && !isViewPsy ? (
            <h3 className="assignment__block-header">{block.question}</h3>
          ) : (
            <div
              className="block__text"
              dangerouslySetInnerHTML={{
                __html: block.description
                  ? !isViewPsy
                    ? block.description
                    : decodeStyledText(block.description)
                  : decodeStyledText(getObjectFromEditorState(block.content)),
              }}
            />
          )}
          <div className="range-display">
            <span className="range-label">{block.leftPole || "Left Pole"}</span>
            <div className="range-options range-options-view">
              {Array.from(
                { length: block.maxValue - block.minValue + 1 },
                (_, i) => i + block.minValue,
              ).map((value) => (
                <label key={value} className="range-option-view">
                  {isMobileWidth ? (
                    <>
                      <span className="range-option-label">{value}</span>
                      <input
                        type="radio"
                        name={`range-${block.id}`}
                        value={value}
                        onChange={handleRangeClick}
                        defaultChecked={value.toString() === block.reply}
                        disabled={isView}
                        className="block-radio__input"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="radio"
                        name={`range-${block.id}`}
                        value={value}
                        onChange={handleRangeClick}
                        defaultChecked={value.toString() === block.reply}
                        disabled={isView}
                      />
                      <span className="range-option-label">{value}</span>
                    </>
                  )}
                </label>
              ))}
            </div>
            <span className="range-label">
              {block.rightPole || "Right Pole"}
            </span>
          </div>
        </div>
      </div>
    );
  } else if (block.type === "range") {
    return (
      <div
        className={`block assignment__block ${!isValid() && showInvalidInputs ? "uncompleted" : ""}`}
      >
        <div>
          {!block.description && !isViewPsy ? (
            <h3 className="assignment__block-header">{block.question}</h3>
          ) : (
            <div
              className="block__text"
              dangerouslySetInnerHTML={{
                __html: block.description
                  ? !isViewPsy
                    ? block.description
                    : decodeStyledText(block.description)
                  : decodeStyledText(getObjectFromEditorState(block.content)),
              }}
            />
          )}
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
                  {isMobileWidth ? (
                    <>
                      <span className="range-option-label">{value}</span>
                      <input
                        type="radio"
                        name={`range-${block.id}`}
                        value={value}
                        onChange={handleRangeClick}
                        defaultChecked={value.toString() === block.reply}
                        disabled={isView}
                        className="block-radio__input"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="radio"
                        name={`range-${block.id}`}
                        value={value}
                        onChange={handleRangeClick}
                        defaultChecked={value.toString() === block.reply}
                        disabled={isView}
                      />
                      <span className="range-option-label">{value}</span>
                    </>
                  )}
                </label>
              ))}
            </div>
            <span className="range-label">
              {block.right_pole || "Right Pole"}
            </span>
          </div>
        </div>
      </div>
    );
  }
  if (block.type === "single") {
    return (
      <div
        className={`block assignment__block ${!isValid() && showInvalidInputs ? "uncompleted" : ""}`}
      >
        <div>
          {!block.description && !isViewPsy ? (
            <h4 className="assignment__block-header">{block.question}</h4>
          ) : (
            <div
              className="block__text"
              dangerouslySetInnerHTML={{
                __html: block.description
                  ? !isViewPsy
                    ? block.description
                    : decodeStyledText(block.description)
                  : decodeStyledText(getObjectFromEditorState(block.content)),
              }}
            />
          )}
          <fieldset className="assignments__block-radio">
            {block.choice_replies.map((radio, index) => {
              return (
                <div className="block-radio__input-container" key={index}>
                  <input
                    type="radio"
                    className="block-radio__input"
                    id={radio.id}
                    name={block.question}
                    value={radio.reply}
                    style={{ opacity: 0.8 }}
                    onChange={handleSingleMultipleClick}
                    defaultChecked={radio.checked}
                    disabled={isView}
                  ></input>
                  <label className="block-radio__label" htmlFor={radio.id}>
                    {radio.reply}
                  </label>
                </div>
              );
            })}
          </fieldset>
        </div>
      </div>
    );
  }
  if (block.type === "multiple") {
    return (
      <div
        className={`block assignment__block ${!isValid() && showInvalidInputs ? "uncompleted" : ""}`}
      >
        <div>
          {!block.description && !isViewPsy ? (
            <h4 className="assignment__block-header">{block.question}</h4>
          ) : (
            <div
              className="block__text"
              dangerouslySetInnerHTML={{
                __html: block.description
                  ? !isViewPsy
                    ? block.description
                    : decodeStyledText(block.description)
                  : decodeStyledText(getObjectFromEditorState(block.content)),
              }}
            />
          )}
          <p className="assignment__block-note">
            More than one answer possible
          </p>
          <fieldset className="assignments__block-radio">
            {block.choice_replies.map((checkbox, index) => {
              return (
                <div className="block-radio__input-container" key={index}>
                  <input
                    type="checkbox"
                    className="block-checkbox__input"
                    id={checkbox.id}
                    name={block.question}
                    value={checkbox.reply}
                    style={{ opacity: 0.8 }}
                    onChange={handleSingleMultipleClick}
                    defaultChecked={checkbox.checked}
                    disabled={isView}
                  ></input>
                  <label className="block-radio__label" htmlFor={checkbox.id}>
                    {checkbox.reply}
                  </label>
                </div>
              );
            })}
          </fieldset>
        </div>
      </div>
    );
  }
}

export { ClientAssignmentBlocks };
