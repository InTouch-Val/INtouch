import CloudUploadSignal from '../../images/CloudUploadSignal.svg';
import IconCopy from'../../images/IconCopy.svg'
import IconTrash from '../../images/FreeIconTrash.svg'
import Button from '../button/ButtonHeadline';
import './HeadlinerImg.css'


function HeadlinerImg(){
  return(
    <>
    <h1>Headline</h1>
    <h2>Add an image</h2>
    <div className="img-container">
        <img src={CloudUploadSignal} alt="CloudUpload" />
      </div>
    <Button>Browse</Button>
    <h3 
    ><span>or drop an image here</span></h3>

    <div className="icon-copy-trash"> 
    {/* иконка мусорного ведра */}
      <img src={IconCopy} alt="Icon-Copy" />
        
    {/* иконка копирования */}
      <img src={IconTrash} alt="Icon-Trash" />
    </div>  
      
    <Button className="saveBlock" >Save block</Button>
  </>
    )
}

export {Button}
export default HeadlinerImg;

