import React, {useState} from 'react';
import CloudUploadSignal from '../../images/CloudUploadSignal.svg';
import IconCopy from'../../images/IconCopy.svg'
import IconTrash from '../../images/FreeIconTrash.svg'
import Button from '../button/ButtonHeadline';
import './HeadlinerImg.css'


function HeadlinerImg(){

  const [blockVisible, setBlockVisible] = useState(true);
  const handleDeleteBlock = () =>{
  setBlockVisible (false);
};

  const handleFileUpload = (event) => {
  const file = event.target.files[0];

  console.log('Selected file:', file);
};
  return(
    blockVisible && (
    <>
    <h1 className='tittle-headline'>Headline</h1>
    <h2 className='add-an-img'>Add an image</h2>
    <div className="img-container">
        <img src={CloudUploadSignal} alt="CloudUpload" />
      
        <Button>
              <label htmlFor='fileInput'>Browse</label>
              <input id='fileInput' type='file' style={{ display: 'none' }} onChange={handleFileUpload} />
       </Button>

    <h3 className='drop-img'>or drop an image here</h3>
  </div>

  <div className='icon-and-button'>
    <div className="icon-copy-trash"> 
     {/* иконка копирования */}
      <img src={IconCopy} alt="Icon-Copy" />
        
     {/* иконка мусорного ведра */}
      <img src={IconTrash} alt="Icon-Trash" onClick={handleDeleteBlock}/>
  </div>  
      
    <Button className="saveBlock">Save block</Button>
  </div>
  </>
    )
  );
}

// export {Button}
export default HeadlinerImg;

