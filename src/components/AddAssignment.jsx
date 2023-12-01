import React, {useState, useEffect} from 'react'
import { EditorState, ContentState, convertFromRaw, convertToRaw } from 'draft-js';
import API from '../service/axios';
import AssignmentBlock from '../service/assignment-blocks';
import { useNavigate, useParams } from 'react-router-dom';
import "../css/assignments.css"
import ImageSelector from '../service/image-selector';

const getPlainText = (editorState) => {
  return editorState.getCurrentContent().getPlainText();
};


const AddAssignment = () => {
  const {id} = useParams()
  const isEditMode = id != undefined

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('lesson');
  const [language, setLanguage] = useState('en');
  const [tags, setTags] = useState('');

  const [blocks, setBlocks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(false)

  const navigate = useNavigate()

  const loadAssignment = async() => {
    if(isEditMode){
      try{
        const response = await API.get(`assignments/${id}/`)
        return response.data
      }
      catch(error){
        console.error("Error getting assignment", error)
      } 
    }
  }

  const setAssignmentCredentials = (data) => {
    setTitle(data.title);
    setDescription(data.text);
    setType(data.assignment_type);
    setLanguage(data.language);
    
    const restoredBlocks = data.blocks.map(block => {
      if (block.type === 'text') {
        const contentState = ContentState.createFromText(block.question);
        return {
          ...block,
          content: EditorState.createWithContent(contentState),
        };
      }
      return block;
    });
  
    setBlocks(restoredBlocks);
    setSelectedImage(data.image_url);
  };
  

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadAssignment()

      if(data){
        console.log(data)
        setAssignmentCredentials(data)
      }
    }

    if(isEditMode){
      fetchData()
    }
  }, [id, isEditMode])


  const handleSubmit = async (e) => {
  e.preventDefault();

  const blockInfo = blocks.map(block => {
    if (block.type === "text") {
      return {
        type: block.type,
        question: block.title,
        reply: getPlainText(block.content),
        choice_replies: []
      };
    } else if (block.type === "range") {
      return {
        type: block.type,
        question: block.title,
        start_range: block.minValue,
        end_range: block.maxValue
      };
    } else {
      return {
        type: block.type,
        question: block.title,
        choice_replies: block.choices.map(choice => ({ reply: choice }))
      };
    }
  });


  const requestData = {
    blocks: blockInfo,
    title: title,
    text: description,
    assignment_type: type,
    tags: "ffasd",
    language: language,
    image_url: selectedImage?.urls.full || "https://images.unsplash.com/photo-1641531316051-30d6824c6460?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1MzE0ODh8MHwxfHNlYXJjaHwxfHxsZW9uaWR8ZW58MHx8fHwxNzAwODE4Nzc5fDA&ixlib=rb-4.0.3&q=85"
  };

  try {
    const response = await API.post('assignments/add/', requestData);
    console.log(response);
    console.log(selectedImage)
    if(response.status == 201){
      setSuccessMessage(true)
      setTimeout(() => {
        navigate('/assignments')
      }, 2000)
    }
    if(response.status == 400){

    }
  } catch (error) {
    console.error("Error creating assignment ", error);
  }
};

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  }

  const addBlock = (type) => {
    const newBlock = {
      id: blocks.length + 1,
      type: type,
      title: '', 
      content: type === 'text' ? EditorState.createEmpty() : '',
      choices: type === 'text' ? [] : ['']
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (blockId) => {
    const updatedBlocks = blocks.filter(block => block.id !== blockId);
    setBlocks(updatedBlocks);
  };

  const updateBlock = (blockId, newContent, newChoices, newTitle, newMinValue, newMaxValue) => {
    const updatedBlocks = blocks.map((block) => {
      if (block.id === blockId) {
        return {
          ...block,
          content: newContent || block.content,
          choices: newChoices || block.choices,
          title: newTitle || block.title,
          minValue: typeof newMinValue !== 'undefined' ? newMinValue : block.minValue,
          maxValue: typeof newMaxValue !== 'undefined' ? newMaxValue : block.maxValue
        };
      }
      return block;
    });
    setBlocks(updatedBlocks);
  };
  
  

  return (
    <div className='assignments-page'>
      {successMessage && <div className='success-message'>Assignment created succesfully</div>}
      <header>
        <h1>Add Assignment</h1>
        {blocks.length > 0 ? <button className='add-assignment-button' onClick={handleSubmit}>Save Assignment</button> : <></>}
      </header>
      <div className='add-assignment-body'>
        <ImageSelector onImageSelect={handleImageSelect}/>
        <form onSubmit={handleSubmit} className="form-creator">
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
              required
            />
          </div>
          <div className='form-settings'>
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
        <div className='block-buttons-container'>
          <div className='block-buttons'>
            <button title="Add Text Block" type="button" onClick={() => addBlock('text')}>  <span class="material-symbols-outlined">text_fields</span></button>
            <button title="Add Multiple Choice Block" type="button" onClick={() => addBlock('multiple')}>  <span class="material-symbols-outlined">select_check_box</span> </button>
            <button title="Add Single Choice Block" type="button" onClick={() => addBlock('single')}>  <span class="material-symbols-outlined">radio_button_checked</span> </button>
            <button title='Add Range Question Block' type='button' onClick={() => addBlock('range')}><span class="material-icons">linear_scale</span></button>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default AddAssignment
