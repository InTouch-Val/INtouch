import { useState, useRef } from 'react';
import CloudUploadSignal from '../../../images/CloudUploadSignal.svg';
import IconCopy from '../../../images/IconCopy.svg';
import Button from '../button/ButtonHeadline';
import './HeadlinerImg.css';

function HeadlinerImg({ setSelectedImageForBlock, image, errorText, setErrorText, setIsError }) {
  const [blockVisible, setBlockVisible] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(image || CloudUploadSignal);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const oneMbyte = 1048576; // 1 МБ в байтах

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  // Функция для проверки размера файла
  const isFileSizeValid = (file) => {
    return file.size <= oneMbyte; // 1 МБ
  };

  // Функция для проверки формата файла
  const isImageFormatValid = (file) => {
    const validFormats = ['image/png', 'image/jpeg', 'image/gif'];
    return validFormats.includes(file.type);
  };

  // Функция для чтения файла и установки его в состояние
  const handleFileUploadOrDrop = (file, callback) => {
    if (isImageFormatValid(file) && isFileSizeValid(file)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result); // Вызываем функцию обратного вызова с URL изображения
      };
      reader.readAsDataURL(file); // Читаем файл как Data URL
      setIsError(false);
      setErrorText(
        errorText.replace(
          'Unsupported file format or image is too big. Please use JPG, PNG, or GIF files under 1 MB',
          '',
        ),
      );
    } else {
      setIsError(true);
      setErrorText(
        `${errorText.includes('Unsupported file format or image is too big. Please use JPG, PNG, or GIF files under 1 MB') ? errorText.replace('Unsupported file format or image is too big. Please use JPG, PNG, or GIF files under 1 MBUnsupported file format or image is too big. Please use JPG, PNG, or GIF files under 1 MB', '') : errorText} Unsupported file format or image is too big. Please use JPG, PNG, or GIF files under 1 MB`,
      );
    }
  };

  // Обновленные функции handleDrop и handleFileUpload
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0]; // Получаем первый файл
      handleFileUploadOrDrop(file, (uploadedImage) => {
        setUploadedImage(uploadedImage); // Устанавливаем URL изображения в состояние
        setSelectedImageForBlock({
          file: file, // Сохраняем файл изображения
          url: uploadedImage, // Сохраняем URL изображения
        });
      });
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files; // Используйте event.target.files для доступа к файлам
    if (files.length > 0) {
      const file = files[0]; // Получаем первый файл
      handleFileUploadOrDrop(file, (uploadedImage) => {
        setUploadedImage(uploadedImage); // Устанавливаем URL изображения в состояние
        setSelectedImageForBlock({
          file: file, // Сохраняем файл изображения
          url: uploadedImage, // Сохраняем URL изображения
        });
      });
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
          <div
            className={`headline__img-container ${errorText.includes('Unsupported file format or image is too big. Please use JPG, PNG, or GIF files under 1 MB') && 'error'}`}
          >
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
