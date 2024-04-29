import React, { useState, useRef } from 'react';
import { EditorState } from 'draft-js';
import { EditorToolbar } from '../../editors-toolbar';
import { ToolbarProvider } from '../../ToolbarContext';
import arrow from '../../../images/arrow.svg';
import copy from '../../../images/block-copy-btn.svg';
import trash from '../../../images/block-trash-btn.svg';

function Block({
  block,
  removeBlock,
  heading,
  question,
  placeholder,
  copyBlock,
  moveBlockForward,
  moveBlockBackward,
  updateBlock,
  index = { index },
  ...props
}) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    // Конвертируем editorState в строку и обновляем title
    const contentState = newEditorState.getCurrentContent();
    const text = contentState.getPlainText();
    updateBlock(block.id, contentState, block.choices, text);
  };

  const editorRef = useRef(null);

  return (
    <div className="block-container">
      <h2>{heading}</h2>
      <div className="block">
        <div className="control-panel">
          <input
            type="text"
            value={block.question}
            placeholder={placeholder}
            className="block-title-input"
            style={{ display: 'none' }}
            onChange={() => {}}
          />
          <ToolbarProvider>
            <EditorToolbar
              ref={editorRef}
              editorState={editorState}
              setEditorState={handleEditorStateChange}
              placeholder={placeholder}
              block={block}
            />
          </ToolbarProvider>
        </div>
        {props.children}
        <div className="buttons">
          <button
            type="button"
            onClick={() => {
              moveBlockBackward(index);
            }}
            className="button"
          >
            <img src={arrow} alt="arrow-icon" style={{ transform: 'rotate(180deg)' }}></img>
          </button>
          <button
            type="button"
            onClick={() => {
              moveBlockForward(index);
            }}
            className="button"
          >
            <img src={arrow} alt="arrow-icon"></img>
          </button>
          <button
            type="button"
            onClick={() => {
              copyBlock(block);
            }}
            className="button"
          >
            <img src={copy} alt="arrow-icon"></img>
          </button>
          <button
            type="button"
            onClick={() => {
              removeBlock(block.id);
            }}
            className="button"
          >
            <img src={trash} alt="arrow-icon"></img>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Block;
