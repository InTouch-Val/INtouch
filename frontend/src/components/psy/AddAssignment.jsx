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
import { AssignmentBlock } from '../../service/psyAssignment/AssignmentBlock';
import { ImageSelector } from '../../service/image-selector';
import { useAuth } from '../../service/authContext';
import { Modal } from '../../service/modal';
import { Headline } from './Headline';
import { ImageQuestionBlock } from './ImageQuestionBlock';
import HeadlinerImg from './HeadlinerImg/HeadlinerImg';
import '../../css/assignments.css';
import HeaderAssignment from './HeaderAssigmentPage/HeaderAssignment';

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
  const [successMessageText, setSuccessMessageText] = useState('');
  const [selectedImageForBlock, setSelectedImageForBlock] = useState({
    file: null, // Файл изображения
    url: null, // URL изображения, полученный с помощью FileReader
  });

  const [isChangeView, setChangeView] = useState(false);

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
        let contentState;
        try {
          // Проверяем, что description не пустая
          if (block.description) {
            const rawContent = JSON.parse(block.description);
            contentState = convertFromRaw(rawContent);
            console.log(contentState);
          } else {
            // Если description пустая, создаем пустое содержимое
            contentState = ContentState.createFromText(block.question);
          }
        } catch (error) {
          console.error('Ошибка при обработке содержимого:', error);
          // Создаем ContentState с текстом из data.title для всех типов блоков, кроме 'text'
          if (block.type !== 'text') {
            contentState = ContentState.createFromText(block.question);
          } else {
            // Для типа 'text' создаем пустое содержимое, если описание не может быть обработано
            contentState = ContentState.createFromText(block.question);
          }
        }

        if (block.type === 'text') {
          return {
            ...block,
            content: EditorState.createWithContent(contentState),
          };
        }
        if (block.type === 'single' || block.type === 'multiple') {
          return {
            ...block,
            choices: block.choice_replies.map((choice) => choice.reply),
            content: EditorState.createWithContent(contentState),
          };
        }
        if (block.type === 'range') {
          return {
            ...block,
            minValue: block.start_range,
            maxValue: block.end_range,
            content: EditorState.createWithContent(contentState),
          };
        }
        if (block.type === 'image') {
          return {
            ...block,
            content: EditorState.createWithContent(contentState),
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

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    const blockInfo = blocks.map((block) => {
      if (block.type === 'text' || 'open') {
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
      if (block.type === 'image') {
        return {
          type: block.type,
          question: block.title,
          image: selectedImageForBlock.file,
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
        selectedImage?.url ||
        'https://images.unsplash.com/photo-1641531316051-30d6824c6460?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1MzE0ODh8MHwxfHNlYXJjaHwxfHxsZW9uaWR8ZW58MHx8fHwxNzAwODE4Nzc5fDA&ixlib=rb-4.0.3&q=85',
    };

    try {
      let response;
      if (!isEditMode) {
        // Если задание создается впервые, выполняем POST запрос
        response = await API.post('assignments/', requestData);
        if (!response || !response.data || !response.data.id) {
          throw new Error('Failed to create assignment');
        }
        // Получаем ID созданного задания
        const assignmentId = response.data.id;

        if (isDraft) {
          // Если задание должно быть сохранено как черновик, выполняем GET запрос
          await API.get(`assignments/${assignmentId}/draft/`);
        }
      } else {
        // Если задание уже существует, выполняем PUT запрос
        response = await API.put(`assignments/${id}/`, requestData);
        if (isDraft) {
          // Если задание должно быть перемещено в черновик, выполняем GET запрос
          await API.get(`assignments/${id}/draft/`);
        }
      }

      if ([200, 201].includes(response.status)) {
        if (!isDraft) {
          setTimeout(() => {
            navigate('/assignments');
          }, 2000);

          setSuccessMessageText('Assignment created succesfully');
          setSuccessMessage(true);
        } else {
          setSuccessMessageText('Draft created succesfully');
          setSuccessMessage(true);
        }
      }
    } catch (error) {
      setErrorText('Fill in all the fields..');
      console.error('Error creating assignment', error);
    }
  };

  const [errorText, setErrorText] = useState('');

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const addBlock = (type) => {
    const newBlock = {
      id: blocks.length + 1,
      type,
      title: '',
      content: type === 'text' || 'open' ? EditorState.createEmpty() : '',
      choices: type === 'text' || 'open' ? [] : [''],
      minValue: type === 'range' ? 1 : null,
      maxValue: type === 'range' ? 10 : null,
      image: type === 'image' ? '' : null,
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (blockId) => {
    const updatedBlocks = blocks.filter((block) => block.id !== blockId);
    setBlocks(updatedBlocks);
  };

  const copyBlock = (block) => {
    const maxId = Math.max(...blocks.map((b) => b.id));
    const newBlock = { ...block, id: maxId + 1 };

    const index = blocks.findIndex((b) => b.id === block.id);

    blocks.splice(index + 1, 0, newBlock);

    setBlocks([...blocks]);
  };

  const moveBlockForward = (index) => {
    // Проверяем, не является ли текущий блок последним в массиве
    if (index < blocks.length - 1) {
      // Сохраняем текущий блок
      const block = blocks[index];
      // Удаляем блок из текущей позиции
      blocks.splice(index, 1);
      // Добавляем блок обратно в массив, но на позицию на одну вперед
      blocks.splice(index + 1, 0, block);
      // Обновляем состояние
      setBlocks([...blocks]);
    }
  };

  const moveBlockBackward = (index) => {
    // Проверяем, не является ли текущий блок первым в массиве
    if (index > 0) {
      // Сохраняем текущий блок
      const block = blocks[index];
      // Удаляем блок из текущей позиции
      blocks.splice(index, 1);
      // Добавляем блок обратно в массив, но на позицию на одну назад
      blocks.splice(index - 1, 0, block);
      // Обновляем состояние
      setBlocks([...blocks]);
    }
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
    newImage,
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
          image: newImage === undefined ? block.image : newImage,
        };
      }
      return block;
    });
    setBlocks(updatedBlocks);
  };

  console.log(blocks);

  return (
    <div className="assignments-page">
      {successMessage && <div className="success-message">{successMessageText}</div>}
      <HeaderAssignment
        blocks={blocks}
        handleSubmit={(e) => handleSubmit(e, true)}
        errorText={errorText}
        changeView={() => {
          setChangeView((prev) => !prev);
        }}
      />
      <div className="form-title">
        <input
          type="text"
          className="title-input"
          placeholder="Name of Assignment..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          className="title-input"
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="add-assignment-body">
        <ImageSelector onImageSelect={handleImageSelect} />
        <form onSubmit={(e) => handleSubmit(e, false)} className="form-creator">
          {blocks.map((block, index) => (
            <div key={index}>
              {block.type === 'headline' && <Headline block={block} updateBlock={updateBlock} />}
              {block.type === 'imageQuestion' && (
                <ImageQuestionBlock block={block} updateBlock={updateBlock} />
              )}
              {block.type === 'headlinerImg' && (
                <HeadlinerImg
                  block={block}
                  updateBlock={updateBlock}
                  setSelectedImageForBlock={setSelectedImageForBlock}
                />
              )}
            </div>
          ))}
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
          {isChangeView ? (
            <>
              {Array.from(blocks).map((block, index) => (
                <AssignmentBlock
                  key={block.id}
                  block={block}
                  updateBlock={updateBlock}
                  removeBlock={removeBlock}
                  copyBlock={copyBlock}
                  moveBlockForward={moveBlockForward}
                  moveBlockBackward={moveBlockBackward}
                  index={index}
                  readOnly={true}
                  isView={true}
                  setSelectedImageForBlock={setSelectedImageForBlock}
                />
              ))}
            </>
          ) : (
            <>
              {blocks.map((block, index) => (
                <AssignmentBlock
                  key={block.id}
                  block={block}
                  updateBlock={updateBlock}
                  removeBlock={removeBlock}
                  copyBlock={copyBlock}
                  moveBlockForward={moveBlockForward}
                  moveBlockBackward={moveBlockBackward}
                  index={index}
                  setSelectedImageForBlock={setSelectedImageForBlock}
                />
              ))}
            </>
          )}
        </form>
        <div className="block-buttons-container">
          <div className="block-buttons">
            <button title="Add Text Block" onClick={() => addBlock('text')}>
              <FontAwesomeIcon icon={faComment} />{' '}
            </button>
            <button title="Add Open-Question Block" onClick={() => addBlock('open')}>
              <FontAwesomeIcon icon={faQuestion} />{' '}
            </button>
            <button title="Add Multiple Choice Block" onClick={() => addBlock('multiple')}>
              <FontAwesomeIcon icon={faSquareCheck} />{' '}
            </button>
            <button title="Add Single Choice Block" onClick={() => addBlock('single')}>
              <FontAwesomeIcon icon={faCircleDot} />{' '}
            </button>
            <button title="Add Linear Scale Question Block" onClick={() => addBlock('range')}>
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            <button title="Add Image" onClick={() => addBlock('image')}>
              <FontAwesomeIcon icon={faImage} />
            </button>
          </div>
        </div>
        <div className="buttons-save-as-draft-and-publish-container">
          <button
            className="buttons-save-as-draft-and-publish"
            onClick={(e) => handleSubmit(e, true)}
          >
            Save as Draft
          </button>
          <button
            className="buttons-save-as-draft-and-publish"
            onClick={(e) => handleSubmit(e, false)}
          >
            Complete & Publish
          </button>
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

  console.log('data', assignmentData);

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
