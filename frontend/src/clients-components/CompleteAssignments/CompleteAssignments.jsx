import React, { useState, useEffect } from 'react';
import save from '../../images/save.svg';
import image from '../../images/image2.svg';
import imageGirl from '../../images/image_girl.png';
import arrowLeft from '../../images/arrow-left.svg';
import { EditorState, ContentState, convertFromRaw } from 'draft-js';
import EditorToolbar from '../../service/editors-toolbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../../css/block.css';
import '../../css/assignments.css';

function CompleteAssignments() {
  const [editorStateFirst, setEditorStateFirst] = React.useState(() => EditorState.createEmpty());

  const [editorStateSecond, setEditorStateSecond] = React.useState(() => EditorState.createEmpty());

  const [editorStateThird, setEditorStateThird] = React.useState(() => EditorState.createEmpty());

  return (
    <>
      <div className="assignment-header">
        <div className="assignment__container_button">
          <button className="button__type_back">
            <img src={arrowLeft}></img>
          </button>
          <button className="button__type_save">
            <img src={save}></img>
          </button>
        </div>
        <h1 className="assignment__name">Socratic Dialogue</h1>
        <p className="assignment__progress">in progress</p>
      </div>
      <img className="assignment__image" src={image}></img>
      <p className="aassignment__paragraph">
        Dear Benjamin,
        <br />
        <br />
        This exercise uses a technique called Socratic Dialogue, which will help you to determine
        how accurate and helpful certain thoughts may be.
        <br />
        <br /> Specifically, this is done by exploring how you came to have those thoughts, and
        evaluating the evidence regarding those and other possible thoughts.
      </p>
      <div className="block assignment__block">
        <h4 className="assignment__block-header">Thought to be questioned:</h4>
        <EditorToolbar editorState={editorStateFirst} setEditorState={setEditorStateFirst} />
      </div>
      <div className="block assignment__block">
        <h4 className="assignment__block-header">What is the evidence for this thought?</h4>
        <EditorToolbar editorState={editorStateSecond} setEditorState={setEditorStateSecond} />
      </div>
      <div className="block assignment__block">
        <h4 className="assignment__block-header">What is the evidence against it?</h4>
        <EditorToolbar editorState={editorStateThird} setEditorState={setEditorStateThird} />
      </div>
      <div className="block assignment__block">
        <h4 className="assignment__block-header">#4 Question</h4>
        <fieldset className="assignments__block-radio">
          <div className="block-radio__input-container">
            <input
              type="radio"
              className="block-radio__input"
              id="1"
              name="#4 Question"
              value="Answer 1"
              style={{ opacity: 0.8 }}
            ></input>
            <label className="block-radio__label" for="1">
              Answer 1
            </label>
          </div>
          <div className="block-radio__input-container ">
            <input
              type="radio"
              className="block-radio__input"
              id="2"
              name="#4 Question"
              value="Answer 2"
              style={{ opacity: 0.8 }}
            />
            <label for="2" className="block-radio__label">
              Answer 2
            </label>
          </div>
          <div className="block-radio__input-container">
            <input
              type="radio"
              className="block-radio__input"
              id="3"
              name="#4 Question"
              value="Answer 3"
              style={{ opacity: 0.8 }}
            />
            <label for="3" className="block-radio__label">
              Answer 3
            </label>
          </div>
        </fieldset>
      </div>
      <div className="block assignment__block">
        <h4 className="assignment__block-header header_margin">#5 Question</h4>
        <p className="assignment__block-note">more than one answer possible</p>
        <fieldset className="assignments__block-radio">
          <div className="block-radio__input-container">
            <input
              type="checkbox"
              className="block-checkbox__input"
              id="1"
              name="#4 Question"
              value="Answer 1"
              style={{ opacity: 0.8 }}
            ></input>
            <label className="block-radio__label" for="1">
              Answer 1
            </label>
          </div>
          <div className="block-radio__input-container">
            <input
              type="checkbox"
              className="block-checkbox__input"
              id="2"
              name="#4 Question"
              value="Answer 2"
              style={{ opacity: 0.8 }}
            />
            <label for="2" className="block-radio__label">
              Answer 2
            </label>
          </div>
          <div className="block-radio__input-container">
            <input
              type="checkbox"
              className="block-checkbox__input"
              id="3"
              name="#4 Question"
              value="Answer 3"
              style={{ opacity: 0.8 }}
            />
            <label for="3" className="block-radio__label">
              Answer 3
            </label>
          </div>
        </fieldset>
      </div>
      <div className="block assignment__block">
        <h4 className="assignment__block-header">#6 Question</h4>
        <fieldset className="assignments__block-radio block-radio__rate">
          <p className="block-radio_rate-text">Левый полюс</p>
          <div className="block-radio__input-container block-radio__rate-container">
            <label className="block-radio__label_rate" for="1">
              1
            </label>
            <input
              type="radio"
              className="block-radio__input"
              id="1"
              name="#6 Question"
              value="Answer 1"
              style={{ opacity: 0.8 }}
            ></input>
          </div>
          <div className="block-radio__input-container block-radio__rate-container">
            <label for="2" className="block-radio__label_rate">
              2
            </label>
            <input
              type="radio"
              className="block-radio__input"
              id="2"
              name="#6 Question"
              value="Answer 2"
              style={{ opacity: 0.8 }}
            />
          </div>
          <div className="block-radio__input-container block-radio__rate-container">
            <label for="3" className="block-radio__label_rate">
              3
            </label>
            <input
              type="radio"
              className="block-radio__input"
              id="3"
              name="#6 Question"
              value="Answer 3"
              style={{ opacity: 0.8 }}
            />
          </div>
          <div className="block-radio__input-container block-radio__rate-container">
            <label for="3" className="block-radio__label_rate">
              4
            </label>
            <input
              type="radio"
              className="block-radio__input"
              id="4"
              name="#6 Question"
              value="Answer 3"
              style={{ opacity: 0.8 }}
            />
          </div>
          <div className="block-radio__input-container block-radio__rate-container">
            <label for="3" className="block-radio__label_rate">
              5
            </label>
            <input
              type="radio"
              className="block-radio__input"
              id="5"
              name="#6 Question"
              value="Answer 3"
              style={{ opacity: 0.8 }}
            />
          </div>
          <p className="block-radio_rate-text">Правый полюс</p>
        </fieldset>
      </div>
      <div className="block assignment__block">
        <h4 className="assignment__block-header">#7 Text</h4>
        <p className="block__text">Lorem Ipsum dolor sit amet</p>
      </div>
      <div className="block assignment__block">
        <h4 className="assignment__block-header">#7 Image</h4>
        <img className="block__image" src={imageGirl} />
      </div>
      <div className="assignment__share-box">
        <p className="assignment__share-text">Share this task with my therapist</p>
        <input
          type="checkbox"
          className="assignment__share-checkbox_invisible"
          id="share"
          name="share"
        />
        <span className="visible-checkbox"></span>
      </div>
      <div className="assignment__buttons-box">
        <button className="action-button assignment__button">Complete Task</button>
        <button className="action-button assignment__button">Rate Task</button>
      </div>
    </>
  );
}

export default CompleteAssignments;
