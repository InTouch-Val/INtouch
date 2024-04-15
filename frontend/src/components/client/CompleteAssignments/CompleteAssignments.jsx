import { useState, useCallback, useEffect } from 'react';
import { EditorState } from 'draft-js';
import { EditorToolbar } from '../../../service/editors-toolbar';
import { useAuth } from '../../../service/authContext';
import { NavLink } from 'react-router-dom';
import save from '../../../images/save.svg';
import image from '../../../images/image2.svg';
import imageGirl from '../../../images/image_girl.png';
import arrowLeft from '../../../images/arrow-left.svg';
import arrowBack from '../../../images/arrowBackWhite.svg';
import sadEmote from '../../../images/sadEmote.svg';
import smilyEmote from '../../../images/smilyEmote.svg';
import '../../../css/block.css';
import '../../../css/assignments.css';
import { ClientAssignmentBlocks } from '../../../service/ClientAssignmentBlocks';
import { API } from '../../../service/axios';
import { useNavigate } from 'react-router-dom';

function CompleteAssignments() {
  const [isRateTask, setIsRateTask] = useState(false);
  const [editorStateFirst, setEditorStateFirst] = useState(() => EditorState.createEmpty());
  const [editorStateSecond, setEditorStateSecond] = useState(() => EditorState.createEmpty());
  const [editorStateThird, setEditorStateThird] = useState(() => EditorState.createEmpty());
  const { setCurrentCard, card } = useAuth();
  const [values, setValues] = useState({});
  const [blocks, setBlocks] = useState([]);
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
              initialDescription: block.description,
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

  useEffect(() => {
    setBlocks(assignmentData.blocks);
  }, [assignmentData]);

  useEffect(() => {
    console.log(blocks);
  }, [blocks]);

  const updateBlock = (blockId, newReply, newChoices) => {
    const updatedBlocks = blocks.map((block) => {
      if (block.id === blockId) {
        return {
          ...block,
          reply: newReply || block.reply,
          choice_replies: newChoices || block.choice_replies,
        };
      }
      return block;
    });
    setBlocks(updatedBlocks);
  };

  function handleValues(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    console.log(event.target);
  }

  const [valueOfRate, setValueOfRate] = useState(null);

  const handleRadioChange = (event) => {
    setValueOfRate(parseInt(event.target.value));
  };
  //console.log(values)

  function handleRateTaskBtnClick() {
    setIsRateTask(!isRateTask);
  }

  async function handleShareWithTherapist() {
    try {
      const res = await API.put(`assignments-client/${assignmentData.id}/visible/`);
      if (res.status >= 200 && res.status < 300) {
        console.log(res.data);
      } else {
        console.log(`Status: ${res.status}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const navigate = useNavigate(); // Получите доступ к history

  function transformBlock(block) {
    if (block.type === 'text' || block.type === 'open') {
      return {
        type: block.type,
        question: block.question,
        description: block.initialDescription,
        reply: block.reply,
      };
    }
    if (block.type === 'range') {
      return {
        type: block.type,
        question: block.question,
        start_range: block.minValue,
        end_range: block.maxValue,
        reply: block.reply,
        left_pole: block.leftPole || 'Left Pole',
        right_pole: block.rightPole || 'Right Pole',
      };
    }
    if (block.type === 'image') {
      return {
        type: block.type,
        question: block.question,
        image: block.image,
      };
    }
    return {
      type: block.type,
      question: block.question,
      choice_replies: block.choice_replies,
    };
  }

  async function handleDoneWithReview() {
    const blockInfo = blocks.map(transformBlock);

    try {
      const res = await API.put(`assignments-client/${assignmentData.id}/`, {
        grade: parseInt(valueOfRate, 10),
        review: document.getElementById('text').value, // Получаем значение из textarea
        blocks: blockInfo,
      });
      if (res.status >= 200 && res.status < 300) {
        console.log(res.data);
        const resComplete = await API.get(`assignments-client/${assignmentData.id}/complete/`);
        if (resComplete.status >= 200 && resComplete.status < 300) {
          navigate('/my-assignments');
        } else {
          console.log(`Status: ${resComplete.status}`);
        }
      } else {
        console.log(`Status: ${res.status}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handleCompleteTask() {
    const blockInfo = blocks.map(transformBlock);

    try {
      console.log(blockInfo);
      const res = await API.put(`assignments-client/${assignmentData.id}/`, {
        blocks: blockInfo,
      });
      if (res.status >= 200 && res.status < 300) {
        console.log(res.data);
        const resComplete = await API.get(`assignments-client/${assignmentData.id}/complete/`);
        if (resComplete.status >= 200 && resComplete.status < 300) {
          navigate('/my-assignments');
        } else {
          console.log(`Status: ${resComplete.status}`);
        }
      } else {
        console.log(`Status: ${res.status}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  return isRateTask ? (
    <>
      <h1 className="assignment__name" style={{ textAlign: 'center' }}>
        How helpful was the task?
      </h1>
      <div className="rating-container">
        {Array.from({ length: 11 }, (_, index) => index).map((num) => (
          <label key={num} className="radio-label">
            {num !== 0 && num !== 10 && <div className="mood-number">{num}</div>}
            <input
              type="radio"
              name="mood"
              value={num}
              checked={valueOfRate === num}
              onChange={handleRadioChange}
              className="radio"
            />
            <div
              className={`mood-display ${valueOfRate === num && (num === 0 || num === 10) ? 'emoteActive' : valueOfRate === num ? 'active' : ''}`}
              style={num === 0 || num === 10 ? { border: 'none' } : { display: 'flex' }}
            >
              {num === 0 ? (
                <img
                  src={sadEmote}
                  alt="Грустный смайлик"
                  className={`smiley ${valueOfRate === num ? 'active' : ''}`}
                />
              ) : (
                ''
              )}
              {num === 10 ? (
                <img
                  src={smilyEmote}
                  alt="Весёлый смайлик"
                  className={`smiley ${valueOfRate === num ? 'active' : ''}`}
                />
              ) : (
                ''
              )}
            </div>
          </label>
        ))}
      </div>
      <div className="rateTask__comment-container">
        <label className="rateTask__comment-label" htmlFor="text">
          You can share your feedback with your therapist after completing this task:
        </label>
        <textarea
          className="rateTask__comment-input"
          type="text"
          name="text"
          id="text"
          placeholder="Add some notes here..."
        />
      </div>
      <div className="assignment__buttons-box">
        <button
          onClick={handleRateTaskBtnClick}
          className="button__type_back button__type_back_greenWhite"
        >
          <img src={arrowBack}></img>
        </button>
        <button
          onClick={handleDoneWithReview}
          className="button__type_back button__type_back_greenWhite"
        >
          Done
        </button>
      </div>
    </>
  ) : (
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
        {blocks.length > 0 &&
          blocks.map((block, index) => (
            <ClientAssignmentBlocks
              key={index}
              block={block}
              handleClick={handleValues}
              updateBlock={updateBlock}
            />
          ))}
      </div>
      <div className="assignment__share-container">
        <label className="card__input-label assignment__share-label">
          Share with my therapist
          <input
            type="checkbox"
            className="card__input-checkbox  assignment__share-checkbox"
            defaultChecked={assignmentData?.visible}
            onClick={() => handleShareWithTherapist(assignmentData?.id)}
          />
        </label>
      </div>
      <div className="assignment__buttons-box">
        <button onClick={handleCompleteTask} className="action-button assignment__button">
          Complete Task
        </button>
        <button onClick={handleRateTaskBtnClick} className="action-button assignment__button">
          Rate Task
        </button>
      </div>
    </>
  );
}

export { CompleteAssignments };
