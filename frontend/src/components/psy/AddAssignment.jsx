import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorState, ContentState, convertFromRaw } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment,
  faSquareCheck,
  faCircleDot,
  faEllipsis,
  faImage,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { API } from '../../service/axios';
import { AssignmentBlock } from '../../service/assignment-blocks';
import { ImageSelector } from '../../service/image-selector';
import { useAuth } from '../../service/authContext';
import { Modal } from '../../service/modal';
import { Headline } from './Headline';
import { ImageQuestionBlock } from './ImageQuestionBlock';
import HeadlinerImg from './HeadlinerImg/HeadlinerImg';
import '../../css/assignments.css';

const getObjectFromEditorState = (editorState) => JSON.stringify(editorState);

function AddAssignment() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('lesson');
  const [language, setLanguage] = useState('en');
  const [tags, setTags] = useState('');

  const [blocks, setBlocks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id != undefined;

  const fetchAssignment = useCallback(async () => {
    try {
      const response = await API.get(`assignments/${id}/`);
      setTitle(response.data.title);
      setDescription(response.data.text);
      setType(response.data.assignment_type);
      setLanguage(response.data.language);
      setSelectedImage({ urls: { full: response.data.image_url } }); // Assuming your ImageSelector expects an object like this

      const fetchedBlocks = response.data.blocks.map((block) => {
        if (block.type === 'text') {
          let contentState;
          try {
            const rawContent = JSON.parse(block.description);
            contentState = convertFromRaw(rawContent);
            console.log(contentState);
          } catch (error) {
            console.error('Ошибка при обработке содержимого:', error);
            contentState = ContentState.createFromText(''); // Создаем пустое содержимое в случае ошибки
          }

          return {
            ...block,
            title: block.question,
            content: EditorState.createWithContent(contentState),
          };
        }
        if (block.type === 'single' || block.type === 'multiple') {
          return {
            ...block,
            title: block.question,
            choices: block.choice_replies.map((choice) => choice.reply),
          };
        }
        if (block.type === 'range') {
          return {
            ...block,
            title: block.question,
            minValue: block.start_range,
            maxValue: block.end_range,
          };
        }
        if (block.type === 'image') {
          return {
            ...block,
            // title: block.question,
            // minValue: block.start_range,
            // maxValue: block.end_range,
          };
        }
        return block;
      });

      setBlocks(fetchedBlocks);
    } catch (error) {
      console.error(error.message);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) {
      fetchAssignment();
    }
  }, [isEditMode, fetchAssignment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const blockInfo = blocks.map((block) => {
      if (block.type === 'text') {
        return {
          type: block.type,
          question: block.title,
          description: getObjectFromEditorState(block.content),
          choice_replies: [],
        };
      }
      if (block.type === 'range') {
        return {
          type: block.type,
          question: block.title,
          start_range: block.minValue,
          end_range: block.maxValue,
          left_pole: block.leftPole || 'Left Pole',
          right_pole: block.rightPole || 'Right Pole',
        };
      }
      return {
        type: block.type,
        question: block.title,
        choice_replies: block.choices.map((choice) => ({ reply: choice })),
      };
    });

    const requestData = {
      blocks: blockInfo,
      title,
      text: description,
      assignment_type: type,
      tags: 'ffasd',
      language,
      image_url:
        selectedImage?.urls.full ||
        'https://images.unsplash.com/photo-1641531316051-30d6824c6460?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1MzE0ODh8MHwxfHNlYXJjaHwxfHxsZW9uaWR8ZW58MHx8fHwxNzAwODE4Nzc5fDA&ixlib=rb-4.0.3&q=85',
    };

    try {
      let response;
      response = await (isEditMode
        ? API.put(`assignments/${id}/`, requestData)
        : API.post('assignments/', requestData));

      if ([200, 201].includes(response.status)) {
        setSuccessMessage(true);
        setTimeout(() => {
          navigate('/assignments');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating assignment', error);
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const addBlock = (type) => {
    const newBlock = {
      id: blocks.length + 1,
      type,
      title: '',
      content: type === 'text' || 'open-question' ? EditorState.createEmpty() : '',
      choices: type === 'text' || 'open-question' ? [] : [''],
      minValue: type === 'range' ? 1 : null,
      maxValue: type === 'range' ? 10 : null,
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (blockId) => {
    const updatedBlocks = blocks.filter((block) => block.id !== blockId);
    setBlocks(updatedBlocks);
  };

  const updateBlock = (
    blockId,
    newContent,
    newChoices,
    newTitle,
    newMinValue,
    newMaxValue,
    newLeftPole,
    newRightPole,
  ) => {
    const updatedBlocks = blocks.map((block) => {
      if (block.id === blockId) {
        return {
          ...block,
          content: newContent || block.content,
          choices: newChoices || block.choices,
          title: newTitle || block.title,
          minValue: newMinValue === undefined ? block.minValue : newMinValue,
          maxValue: newMaxValue === undefined ? block.maxValue : newMaxValue,
          leftPole: newLeftPole === undefined ? block.leftPole : newLeftPole,
          rightPole: newRightPole === undefined ? block.rightPole : newRightPole,
        };
      }
      return block;
    });
    setBlocks(updatedBlocks);
  };

  return (
    <div className="assignments-page">
      {successMessage && <div className="success-message">Assignment created succesfully</div>}
      <header>
        <h1>Add Assignment</h1>
        {blocks.length > 0 ? (
          <button className="action-button" onClick={handleSubmit}>
            Save Assignment
          </button>
        ) : (
          <></>
        )}
      </header>
      <div className="add-assignment-body">
        <ImageSelector onImageSelect={handleImageSelect} />
        <form onSubmit={handleSubmit} className="form-creator">
          {blocks.map((block, index) => (
            <div key={index}>
              {block.type === 'headline' && <Headline block={block} updateBlock={updateBlock} />}
              {block.type === 'imageQuestion' && (
                <ImageQuestionBlock block={block} updateBlock={updateBlock} />
              )}
              {block.type === 'headlinerImg' && (
                <HeadlinerImg block={block} updateBlock={updateBlock} />
              )}
            </div>
          ))}
          <div className="form-title">
            <input
              type="text"
              className="title-input"
              placeholder="Name of form"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              className="title-input"
              placeholder="Give a brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-settings">
            <div className="form-setting">
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="lesson">Lesson</option>
                <option value="exercise">Exercise</option>
                <option value="essay">Essay</option>
                <option value="study">Study</option>
                <option value="quiz">Quiz</option>
                <option value="methology">Methodology</option>
                <option value="metaphor">Metaphor</option>
              </select>
            </div>
            <div className="form-setting">
              <label>Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="ge">German</option>
                <option value="it">Italian</option>
              </select>
            </div>
            <div className="form-setting tags-setting">
              <label>Tags</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
          </div>
          {blocks.map((block) => (
            <AssignmentBlock
              key={block.id}
              block={block}
              updateBlock={updateBlock}
              removeBlock={removeBlock}
            />
          ))}
        </form>
        <div className="block-buttons-container">
          <div className="block-buttons">
            <button title="Add Text Block" onClick={() => addBlock('text')}>
              <FontAwesomeIcon icon={faComment} />{' '}
            </button>
            <button title="Add Question Block">
              <FontAwesomeIcon icon={faQuestion} onClick={() => addBlock('open-question')} />
            </button>
            <button title="Add Multiple Choice Block" onClick={() => addBlock('multiple')}>
              <FontAwesomeIcon icon={faSquareCheck} />{' '}
            </button>
            <button title="Add Single Choice Block" onClick={() => addBlock('single')}>
              <FontAwesomeIcon icon={faCircleDot} />{' '}
            </button>
            <button title="Add Range Question Block" onClick={() => addBlock('range')}>
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            <button title="Add Image" onClick={() => addBlock('image')}>
              <FontAwesomeIcon icon={faImage} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewAssignment() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState();
  const [assignmentData, setAssignmentData] = useState({
    title: '',
    text: '',
    type: '',
    language: '',
    image_url: '',
    author: '',
    blocks: [],
  });

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
    console.log(html);
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

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleDeleteAssignment = async () => {
    try {
      await API.delete(`assignments/${id}/`);
      navigate('/assignments');
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        const response = await API.get(`assignments/${id}/`);
        setAssignmentCredentials(response.data);
      } catch (error) {
        console.error('Error fetching assignment data', error);
        navigate('/assignments'); // Redirect if error
      }
    };

    fetchAssignmentData();
  }, [id, navigate, setAssignmentCredentials]);

  return (
    <div className="assignments-page">
      <header>
        <h1>{assignmentData.title}</h1>
        {currentUser.id === assignmentData.author && (
          <div>
            <button className="action-button" onClick={handleToggleModal}>
              Delete Assignment
            </button>
            <button className="action-button" onClick={() => navigate(`/edit-assignment/${id}`)}>
              Edit Assignment
            </button>
          </div>
        )}
      </header>
      <div className="assignment-view-body">
        <div className="assignment-details">
          <p>
            <strong>Description:</strong> {assignmentData.text}
          </p>
          <p>
            <strong>Author: </strong>
            {assignmentData.author_name}
          </p>
          <p>
            <strong>Type: </strong> {assignmentData.assignment_type}
          </p>
          <p>
            <strong>Language: </strong> {assignmentData.language}
          </p>
          <div className="assignment-blocks">
            {assignmentData.blocks.length > 0 &&
              assignmentData.blocks.map((block, index) => (
                <AssignmentBlock key={index} block={block} readOnly={true} />
              ))}
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={handleToggleModal}
        onConfirm={handleDeleteAssignment}
        confirmText="Delete forever"
      >
        <p>
          Are you sure you want to delete this assignment?{' '}
          <strong>This action is irrevertable!</strong>
        </p>
      </Modal>
    </div>
  );
}

export { AddAssignment, ViewAssignment };
