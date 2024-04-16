import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { EditorToolbar } from '../service/editors-toolbar';
import '../css/block.css';
import '../css/assignments.css';

function ClientAssignmentBlocks({ block, handleClick, updateBlock }) {
  const [choices, setChoices] = useState(block.choices || []);
  const [choiceRefs, setChoiceRefs] = useState([]);
  const [selectedValue, setSelectedValue] = useState(block.reply || null);

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

  function handleValues(event) {
    handleClick(event);
    //  console.log(event.target)
  }

  function handleRangeClick(event) {
    updateBlock(block.id, event.target.value, []);
  }

  function handleOpenChange(event) {
    console.log(event.target.value);
    updateBlock(block.id, event.target.value, []);
  }

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
      } else if (event.target.type === 'radio') {
        return {
          id: choice.id,
          reply: choice.reply,
          checked: false,
        };
      }
      return choice;
    });
    updateBlock(block.id, '', newChoices);
  }

  if (block.type === 'text') {
    return (
      <div className="block assignment__block">
        <h3 className="assignment__block-header">{block.question}</h3>
        <div className="block__text" dangerouslySetInnerHTML={{ __html: block.description }} />
      </div>
    );
  }
  if (block.type === 'open') {
    return (
      <div className="block assignment__block">
        <h3 className="assignment__block-header">{block.question}</h3>
        <textarea
          className="block-text answer-input"
          name="openAnswer"
          id=""
          placeholder="Write your answer here..."
          onChange={handleOpenChange}
        >
          {block.reply}
        </textarea>
      </div>
    );
  }
  if (block.type === 'image') {
    return (
      <div className="block assignment__block">
        <h3 className="assignment__block-header">{block.question}</h3>
        <img className="block-image" src={block.image} alt={block.question} />
      </div>
    );
  }
  if (block.type === 'range') {
    return (
      <div className="block assignment__block">
        <h3 className="assignment__block-header">{block.question}</h3>
        <div className="range-display">
          <span className="range-label">{block.left_pole || 'Left Pole'}</span>
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
                  onChange={handleRangeClick}
                  defaultChecked={value.toString() === block.reply}
                />
                <span className="range-option-label">{value}</span>
              </label>
            ))}
          </div>
          <span className="range-label">{block.right_pole || 'Right Pole'}</span>
        </div>
      </div>
    );
  }
  if (block.type === 'single') {
    return (
      <div className="block assignment__block">
        <h4 className="assignment__block-header">{block.question}</h4>
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
                ></input>
                <label className="block-radio__label" htmlFor={radio.id}>
                  {radio.reply}
                </label>
              </div>
            );
          })}
        </fieldset>
      </div>
    );
  }
  if (block.type === 'multiple') {
    return (
      <div className="block assignment__block">
        <h4 className="assignment__block-header header_margin">{block.question}</h4>
        <p className="assignment__block-note">more than one answer possible</p>
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
                ></input>
                <label className="block-radio__label" htmlFor={checkbox.id}>
                  {checkbox.reply}
                </label>
              </div>
            );
          })}
        </fieldset>
      </div>
    );
  }
}

export { ClientAssignmentBlocks };
