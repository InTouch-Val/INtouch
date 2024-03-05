import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { EditorToolbar } from '../service/editors-toolbar';
import '../css/block.css';
import '../css/assignments.css';

function ClientAssignmentBlocks({ block, handleClick }) {
  const [choices, setChoices] = useState(block.choices || []);
  const [minValue, setMinValue] = useState(block.minValue || 1);
  const [maxValue, setMaxValue] = useState(block.maxValue || 10);
  const [choiceRefs, setChoiceRefs] = useState([]);
  const [leftPole, setLeftPole] = useState(block.leftPole || 'Left Pole');
  const [rightPole, setRightPole] = useState(block.rightPole || 'Right Pole');
  const [values, setValues] = useState({});

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

  if (block.type === 'text') {
    return (
      <div className="block assignment__block">
        <h3 className="assignment__block-header">{block.question}</h3>
        <div className="block__text" dangerouslySetInnerHTML={{ __html: block.description }} />
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
                  onClick={handleValues}
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
                  onClick={handleValues}
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
