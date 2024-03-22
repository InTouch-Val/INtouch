import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { EditorToolbar } from '../editors-toolbar';
import '../../css/block.css';
import HeadlinerImg from '../../components/psy/HeadlinerImg/HeadlinerImg';
import Block from './Block/Block';

function AssignmentBlock({
  block,
  updateBlock,
  removeBlock,
  copyBlock,
  moveBlockForward,
  moveBlockBackward,
  index,
  readOnly,
}) {
  const [title, setTitle] = useState(block.title);
  const [choices, setChoices] = useState(block.choices || []);
  const [minValue, setMinValue] = useState(block.minValue || 1);
  const [maxValue, setMaxValue] = useState(block.maxValue || 10);
  const [choiceRefs, setChoiceRefs] = useState([]);
  const [leftPole, setLeftPole] = useState(block.leftPole || 'Left Pole');
  const [rightPole, setRightPole] = useState(block.rightPole || 'Right Pole');

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

  if (readOnly) {
    return (
      <div className="block">
        <div className="block-header">
          <h3 className="block-title">{block.question}</h3>
        </div>
        {block.type === 'text' && <div dangerouslySetInnerHTML={{ __html: block.description }} />}
        {(block.type === 'single' || block.type === 'multiple') && (
          <ul className={`choices-container ${block.type}`}>
            {block.choice_replies.map((choice, index) => (
              <li key={index} className="choice-option">
                {block.type === 'single' ? (
                  <input type="radio" disabled />
                ) : (
                  <input type="checkbox" disabled />
                )}
                <span className="choice-label">{choice.reply}</span>
              </li>
            ))}
          </ul>
        )}
        {block.type === 'range' && (
          <div className="range-display">
            <span className="range-label">{block.left_pole || 'Left Pole'}</span>
            <div className="range-options">
              {Array.from(
                { length: block.end_range - block.start_range + 1 },
                (_, i) => i + block.start_range,
              ).map((value) => (
                <label key={value} className="range-option">
                  <input type="radio" name={`range-${block.id}`} value={value} />
                  <span className="range-option-label">{value}</span>
                </label>
              ))}
            </div>
            <span className="range-label">{block.right_pole || 'Right Pole'}</span>
          </div>
        )}
      </div>
    );
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    updateBlock(block.id, block.content, choices, event.target.value);
  };

  const handleChoiceChange = (index, event) => {
    const newChoices = [...choices];
    newChoices[index] = event.target.value;
    setChoices(newChoices);
    updateBlock(block.id, block.content, newChoices, title);
  };

  const handleMinChange = (change, e) => {
    e.preventDefault();
    const newValue = Math.max(0, minValue + change);
    setMinValue(newValue);
    updateBlock(block.id, block.content, block.choices, title, newValue, maxValue);
  };

  const handleMaxChange = (change, e) => {
    e.preventDefault();
    const newValue = Math.max(minValue, maxValue + change);
    setMaxValue(newValue);
    updateBlock(block.id, block.content, block.choices, title, minValue, newValue);
  };

  const handleNumberChange = (event, type) => {
    const value = parseInt(event.target.value, 10) || 0;
    if (type === 'min') {
      setMinValue(value);
      updateBlock(block.id, block.content, block.choices, title, value, maxValue);
    } else {
      setMaxValue(value);
      updateBlock(block.id, block.content, block.choices, title, minValue, value);
    }
  };

  const handlePoleChange = (pole, value) => {
    if (pole === 'left') {
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
  };

  const handleNewChoiceFocus = (event) => {
    if (event.target.value === '') {
      addChoice();
    }
  };

  const addChoice = () => {
    if (choices.some((choice) => choice.trim() === '')) {
      // Не добавлять новый выбор, если есть пустой
      return;
    }

    const newChoiceRef = React.createRef();
    setChoiceRefs((refs) => [...refs, newChoiceRef]);
    setChoices((currentChoices) => {
      const updatedChoices = [...currentChoices, ''];
      updateBlock(block.id, block.content, updatedChoices, title);
      return updatedChoices;
    });
  };

  const removeChoice = (index) => {
    const newChoices = choices.filter((_, i) => i !== index);
    setChoices(newChoices);
    updateBlock(block.id, block.content, newChoices, title);
  };

  if (block.type === 'text') {
    return (
      <Block
        block={block}
        removeBlock={removeBlock}
        copyBlock={copyBlock}
        heading="Text paragraph"
        question={title}
        updateBlock={updateBlock}
        handleTitleChange={handleTitleChange}
        placeholder="Write question here..."
        moveBlockForward={moveBlockForward}
        moveBlockBackward={moveBlockBackward}
        index={index}
      ></Block>
    );
  }

  if (block.type === 'open') {
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
      ></Block>
    );
  }

  if (block.type === 'range') {
    return (
      <Block
        block={block}
        removeBlock={removeBlock}
        copyBlock={copyBlock}
        heading="Range"
        question={title}
        updateBlock={updateBlock}
        handleTitleChange={handleTitleChange}
        placeholder="Write question here..."
        moveBlockForward={moveBlockForward}
        moveBlockBackward={moveBlockBackward}
        index={index}
      >
        <div className="range-inputs">
          <div className="number-input-container">
            <button onClick={(e) => handleMinChange(-1, e)}>-</button>
            <input type="number" value={minValue} onChange={(e) => handleNumberChange(e, 'min')} />
            <button onClick={(e) => handleMinChange(1, e)}>+</button>
          </div>
          <div className="number-input-container">
            <button onClick={(e) => handleMaxChange(-1, e)}>-</button>
            <input type="number" value={maxValue} onChange={(e) => handleNumberChange(e, 'max')} />
            <button onClick={(e) => handleMaxChange(1, e)}>+</button>
          </div>
          <div className="pole-inputs">
            <input
              type="text"
              value={leftPole}
              onChange={(e) => handlePoleChange('left', e.target.value)}
              placeholder="Input left pole name"
            />
            <input
              type="text"
              value={rightPole}
              onChange={(e) => handlePoleChange('right', e.target.value)}
              placeholder="Input right pole name"
            />
          </div>
        </div>
      </Block>
    );
  }

  if (block.type === 'image') {
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
      >
        <HeadlinerImg />
      </Block>
    );
  }

  return (
    <Block
      block={block}
      removeBlock={removeBlock}
      copyBlock={copyBlock}
      heading={block.type === 'multiple' ? 'Multiple-choice' : 'Single-choice'}
      question={title}
      updateBlock={updateBlock}
      handleTitleChange={handleTitleChange}
      placeholder="Write question here..."
      moveBlockForward={moveBlockForward}
      moveBlockBackward={moveBlockBackward}
      index={index}
    >
      {choices.map((choice, index) => (
        <div key={index} className="choice-option">
          {block.type === 'multiple' ? (
            <input type="checkbox" disabled />
          ) : (
            <input type="radio" disabled />
          )}
          <input
            ref={choiceRefs[index]}
            type="text"
            value={choice}
            onChange={(event) => handleChoiceChange(index, event)}
            placeholder={`Option ${index + 1}`}
            className="choice-input"
          />
          <button type="button" onClick={() => removeChoice(index)} className="button">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      ))}
      <div className="choice-option">
        {block.type === 'single' ? (
          <input type="radio" disabled style={{ opacity: 0.8 }} />
        ) : (
          <input type="checkbox" disabled style={{ opacity: 0.8 }} />
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
