import { useState, useRef } from 'react';
import CloudUploadSignal from '../../../images/CloudUploadSignal.svg';
import IconCopy from '../../../images/IconCopy.svg';
import Button from '../button/ButtonHeadline';
import './HeadlinerImg.css';

function HeadlinerImg({ setSelectedImageForBlock, image }) {
  const [blockVisible, setBlockVisible] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(image || CloudUploadSignal);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0]; // Получаем первый файл
      if (file.type.startsWith('image/')) {
        // Проверяем, что файл является изображением
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImage(reader.result); // Устанавливаем URL изображения в состояние
          setSelectedImageForBlock({
            file: file, // Сохраняем файл изображения
            url: reader.result, // Сохраняем URL изображения
          });
        };
        reader.readAsDataURL(file); // Читаем файл как Data URL
      } else {
        console.log('Файл не является изображением');
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const files = event.target.files; // Используйте event.target.files для доступа к файлам
    if (files.length > 0) {
      const file = files[0]; // Получаем первый файл
      if (file.type.startsWith('image/')) {
        // Проверяем, что файл является изображением
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImage(reader.result); // Устанавливаем URL изображения в состояние
          setSelectedImageForBlock({
            file: file, // Сохраняем файл изображения
            url: reader.result, // Сохраняем URL изображения
          });
        };
        reader.readAsDataURL(file); // Читаем файл как Data URL
      } else {
        console.log('Файл не является изображением');
      }
    }
  };

  return (
    blockVisible && (
      <div className="headline">
        <h2 className="headline__add-an-img">Add an image</h2>
        <div
          id="customFileInput"
          className={
            isDragging ? 'headline__img-input-custom dragging' : 'headline__img-input-custom'
          }
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="headline__img-container">
            <input
              onChange={handleFileUpload}
              id="fileInput"
              className="headline__img-input"
              type="file"
              ref={fileInputRef}
            />
            <img className="headline__img" src={uploadedImage} alt="CloudUpload" />
          </div>

          <div className="headline__browse-container">
            <Button className="headline__browse-btn">
              <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                Browse
              </label>
            </Button>

            <p className="headline__drop-img">or drop an image here</p>
          </div>
        </div>
      </div>
    )
  );
}

// export {Button}
export default HeadlinerImg;
