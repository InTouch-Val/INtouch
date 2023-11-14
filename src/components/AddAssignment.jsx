import React, {useState, useRef} from 'react'
import { EditorState } from 'draft-js';
import axios from 'axios';
import AssignmentBlock from '../service/assignment-blocks';
import { useNavigate } from 'react-router-dom';
import "../css/assignments.css"

const getPlainText = (editorState) => {
  return editorState.getCurrentContent().getPlainText();
};


const AddAssignment = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('lesson');
  const [language, setLanguage] = useState('en');
  const [tags, setTags] = useState('');

  const [blocks, setBlocks] = useState([]);


  const handleSubmit = async (e) => {
  e.preventDefault();

  const blockInfo = blocks.map(block => {
    let content = '';
    if (block.type === "text") {
      content = getPlainText(block.content);
    } else {
      content = block.title;
    }
    
    const choiceReplies = block.choices.map(choice => ({ reply: choice }));

    return {
      type: block.type,
      question: content,
      choice_replies: block.type === 'text' ? [] : choiceReplies 
    };
  });

  const requestData = {
    blocks: blockInfo,
    title: title,
    text: description,
    assignment_type: type,
    tags: "ffasd",
    language: language
  };

  console.log(requestData)

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/v1/assignments/add/', requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      }
    });
    console.log(response.data); 
  } catch (error) {
    console.error("Error creating assignment ", error);
  }
};


  const addBlock = (type) => {
    const newBlock = {
      id: blocks.length + 1,
      type: type,
      title: '', // Заголовок вопроса
      content: type === 'text' ? EditorState.createEmpty() : '',
      choices: type === 'text' ? [] : [''] // Пустой массив для вариантов ответа
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (blockId) => {
    const updatedBlocks = blocks.filter(block => block.id !== blockId);
    setBlocks(updatedBlocks);
  };

  const updateBlock = (blockId, newContent, newChoices, newTitle) => {
    const updatedBlocks = blocks.map((block) => {
      if (block.id === blockId) {
        return {
          ...block,
          content: newContent || block.content,
          choices: newChoices || block.choices,
          title: newTitle || block.title
        };
      }
      return block;
    });
    setBlocks(updatedBlocks);
  };
  
  

  return (
    <div className='assignments-page'>
      <header>
        <h1>Add Assignment</h1>
        {blocks.length > 0 ? <button className='add-assignment-button' onClick={handleSubmit}>Save Assignment</button> : <></>}
      </header>
      <div className='add-assignment-body'>
        <form onSubmit={handleSubmit} ref={formRef} className="form-creator">
          <div className='form-title'>
            <input
              type='text'
              className="title-input" 
              placeholder='Name of form'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type='text'
              className="title-input" 
              placeholder="Give a brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className='form-settings'>
              <div className="form-setting">
                <label>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="lesson">Lessons</option>
                  <option value="exercise">Exercises</option>
                  <option value="metaphor">Metaphors</option>
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
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div> 
          {blocks.map(block => (
            <AssignmentBlock
              key={block.id}
              block={block}
              updateBlock={updateBlock}
              removeBlock={removeBlock}
            />
          ))}
        </form>
        <div className='block-buttons'>
          <button type="button" onClick={() => addBlock('text')}>Add Text Block</button>
          <button type="button" onClick={() => addBlock('multiple')}>Add Multiple Choice Block</button>
          <button type="button" onClick={() => addBlock('single')}>Add Single Choice Block</button>
        </div>
      </div>
    </div>
  );
  
}

export default AddAssignment
