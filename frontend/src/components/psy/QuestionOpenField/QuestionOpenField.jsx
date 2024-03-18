import React from 'react';
import './QuestionOpenField.css';
import { EditorToolbar } from '../../../service/editors-toolbar';
import arrowUp from '../../../images/arrowUp.svg';
import arrowDown from '../../../images/arrowDown.svg';
import copyAlt from '../../../images/copyAlt.svg';
import trash from '../../../images/trashNew.svg';

export default function QuestionOpenField({ block, editorState, setEditorState, removeBlock }) {
  return (
    <section className="blockQuestion">
      <div className="block__title">Open-ended question</div>
      <div className="block__wrapper">
        <div className="block__content">
          <EditorToolbar editorState={editorState} setEditorState={setEditorState} />
        </div>
        <div className="block__buttons">
          <img className="block__icon-button" alt="ArrowUp" src={arrowUp} />
          <img className="block__icon-button" alt="ArrowDown" src={arrowDown} />
          <img className="block__icon-button" alt="CopyAlt" src={copyAlt} />
          <img className="block__icon-button" alt="Trash" src={trash} onClick={removeBlock} />
        </div>
      </div>
    </section>
  );
}
