import { useState, useCallback, useEffect } from 'react';
import { EditorState } from 'draft-js';
import { EditorToolbar } from '../../../service/editors-toolbar';
import { useAuth } from '../../../service/authContext';
import { NavLink } from 'react-router-dom';
import save from '../../../images/save.svg';
import image from '../../../images/image2.svg';
import imageGirl from '../../../images/image_girl.png';
import arrowLeft from '../../../images/arrow-left.svg';
import '../../../css/block.css';
import '../../../css/assignments.css';
import { ClientAssignmentBlocks } from '../../../service/ClientAssignmentBlocks';

function CompleteAssignments() {
  const [editorStateFirst, setEditorStateFirst] = useState(() => EditorState.createEmpty());
  const [editorStateSecond, setEditorStateSecond] = useState(() => EditorState.createEmpty());
  const [editorStateThird, setEditorStateThird] = useState(() => EditorState.createEmpty());
  const { setCurrentCard, card } = useAuth();
  const [values, setValues] = useState({});
  const [assignmentData, setAssignmentData] = useState({
    title: '',
    text: '',
    type: '',
    language: '',
    image_url: '',
    author: '',
    blocks: [],
  });

  console.log(card);

  function decodeStyledText(jsonData) {
    // Parse the JSON data
    const data = JSON.parse(jsonData);

    // Initialize an empty string to hold the HTML
    let html = '';

    // Function to apply styles
    const applyStyles = (char, styles) => {
      if (styles.includes('BOLD')) {
        char = `<b>${char}</b>`;
      }
      if (styles.includes('ITALIC')) {
        char = `<em>${char}</em>`;
      }
      if (styles.includes('UNDERLINE')) {
        char = `<u>${char}</u>`;
      }
      return char;
    };

    // Traverse each block in the blockMap
    for (const blockKey in data._immutable.currentContent.blockMap) {
      const block = data._immutable.currentContent.blockMap[blockKey];

      // Determine the block type
      const blockType = block.type;
      let openTag = '';
      let closeTag = '';
      switch (blockType) {
        case 'unstyled': {
          openTag = '<p>';
          closeTag = '</p>';
          break;
        }
        case 'header-one': {
          openTag = '<h1>';
          closeTag = '</h1>';
          break;
        }
        case 'header-two': {
          openTag = '<h2>';
          closeTag = '</h2>';
          break;
        }
        case 'header-three': {
          openTag = '<h3>';
          closeTag = '</h3>';
          break;
        }
        case 'unordered-list-item': {
          openTag = '<li>';
          closeTag = '</li>';
          break;
        }
        case 'ordered-list-item': {
          openTag = '<li>';
          closeTag = '</li>';
          break;
        }
        default: {
          break;
        }
      }

      // Start the block
      html += openTag;

      // Process each character in the block
      for (let index = 0; index < block.text.length; index++) {
        let char = block.text[index];
        const { style } = block.characterList[index];

        // Apply styles
        char = applyStyles(char, style);

        // Add the character to the HTML string
        html += char;
      }

      // Close the block
      html += closeTag;
    }
    //  console.log(html);
    return html;
  }

  const setAssignmentCredentials = useCallback((data) => {
    const restoredBlocks = data.blocks
      ? data.blocks.map((block) => {
          if (block.type === 'text') {
            // Используем функцию парсинга для получения HTML-текста из JSON Draft.js
            const parsedContent = decodeStyledText(block.description);

            return {
              ...block,
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
  }, []);

  function handleValues(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    console.log(event.target);
  }
  //console.log(values)
  return (
    <>
      <div className="assignment-header">
        <div className="assignment__container_button">
          <NavLink to={'/my-assignments'}>
            <button className="button__type_back">
              <img src={arrowLeft}></img>
            </button>
          </NavLink>
          <button className="button__type_save">
            <img src={save}></img>
          </button>
        </div>
        <h1 className="assignment__name">{assignmentData.title}</h1>
        <p className="assignment__progress">{assignmentData.status}</p>
      </div>
      {assignmentData.image_url ? (
        <img className="assignment__image" src={assignmentData.image_url}></img>
      ) : (
        ''
      )}
      <p className="aassignment__paragraph">{assignmentData.text}</p>
      <div className="assignment-blocks">
        {assignmentData.blocks.length > 0 &&
          assignmentData.blocks.map((block, index) => (
            <ClientAssignmentBlocks key={index} block={block} handleClick={handleValues} />
          ))}
      </div>
      {/*
      <div className="block assignment__block">
        <h4 className="assignment__block-header">Thought to be questioned:</h4>
        <EditorToolbar editorState={editorStateFirst} setEditorState={setEditorStateFirst} />
      </div>
  */}
      {/*
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
            <label className="block-radio__label" htmlFor="1">
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
            <label htmlFor="2" className="block-radio__label">
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
            <label htmlFor="3" className="block-radio__label">
              Answer 3
            </label>
          </div>
        </fieldset>
       </div>
  */}
      {/* <div className="block assignment__block">
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
            <label className="block-radio__label" htmlFor="1">
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
            <label htmlFor="2" className="block-radio__label">
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
            <label htmlFor="3" className="block-radio__label">
              Answer 3
            </label>
          </div>
        </fieldset>
      </div>
  */}
      {/*
      <div className="block assignment__block">
        <h4 className="assignment__block-header">#6 Question</h4>
        <fieldset className="assignments__block-radio block-radio__rate">
          <p className="block-radio_rate-text">Левый полюс</p>
          <div className="block-radio__input-container block-radio__rate-container">
            <label className="block-radio__label_rate" htmlFor="1">
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
            <label htmlFor="2" className="block-radio__label_rate">
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
            style={{ opacity: 0.8 }}

          </div>
          <div className="block-radio__input-container block-radio__rate-container">
            <label htmlFor="3" className="block-radio__label_rate">
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
            style={{ opacity: 0.8 }}

          </div>
          <div className="block-radio__input-container block-radio__rate-container">
            <label htmlFor="3" className="block-radio__label_rate">
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
            <label htmlFor="3" className="block-radio__label_rate">
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
      */}
      {/*
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
    */}
      <div className="assignment__buttons-box">
        <button className="action-button assignment__button">Complete Task</button>
        <button className="action-button assignment__button">Rate Task</button>
      </div>
    </>
  );
}

export { CompleteAssignments };
