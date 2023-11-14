import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import EditorToolbar from '../service/editors-toolbar';

const AssignmentBlock = ({ block, updateBlock, removeBlock }) => {
  if (block.type === 'text') {
    return (
      <div className="text-block">
        <label>Question #{block.id}</label>
        <button type="button" onClick={() => removeBlock(block.id)}>Remove Block</button>
        <EditorToolbar editorState={block.content} setEditorState={(newState) => updateBlock(block.id, newState, block.choices)} />
      </div>
    );
  }

  // Для single и multiple choice блоков
  const handleTitleChange = (event) => {
    updateBlock(block.id, block.content, block.choices, event.target.value);
  };

  const handleChoiceChange = (index, event) => {
    const newChoices = [...block.choices];
    newChoices[index] = event.target.value;
    updateBlock(block.id, block.content, newChoices, block.title);
  };

  const addChoice = () => {
    updateBlock(block.id, block.content, [...block.choices, ''], block.title);
  };

  const removeChoice = (index) => {
    const newChoices = block.choices.filter((_, i) => i !== index);
    updateBlock(block.id, block.content, newChoices, block.title);
  };

  return (
    <div className="choice-block">
      <input
        type="text"
        value={block.title}
        onChange={handleTitleChange}
        placeholder="Question title"
      />
      {block.choices.map((choice, index) => (
        <div key={index} className="choice-option">
          {block.type === 'multiple' ? (
            <input type="checkbox" name={`block-${block.id}-choice`} />
          ) : (
            <input type="radio" name={`block-${block.id}-choice`} />
          )}
          <input
            type="text"
            value={choice}
            onChange={(event) => handleChoiceChange(index, event)}
            placeholder={`Option ${index + 1}`}
          />
          <button type="button" onClick={() => removeChoice(index)}>Remove Option</button>
        </div>
      ))}
      <button type="button" onClick={addChoice}>Add Choice</button>
      <button type="button" onClick={() => removeBlock(block.id)}>Remove Block</button>
    </div>
  );
};

export default AssignmentBlock;
