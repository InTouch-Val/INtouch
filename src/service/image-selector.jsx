import React, { useState } from 'react';
import axios from 'axios';
import "../css/image-selector.css"

const ImageSelector = ({ onImageSelect }) => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImageId, setSelectedImageId] = useState(null); // Состояние для хранения ID выбранного изображения
  const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

  const searchImages = (query) => {
    axios.get(`https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&per_page=10`)
      .then(response => {
        setImages(response.data.results);
      })
      .catch(error => console.error('Error searching images:', error));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchImages(searchTerm);
  };

  const handleImageClick = (image) => {
    setSelectedImageId(image.id); // Обновляем ID выбранного изображения
    onImageSelect(image); // Вызываем функцию onImageSelect с выбранным изображением
  };

  return (
    <div className="image-selector">
      <label>Choose an Image for Your Assignment</label>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for images"
        />
        <button type="submit">Search</button>
      </form>
      <div className="image-results">
        {images.map(image => (
          <div 
            key={image.id} 
            className={`image-item ${image.id === selectedImageId ? 'selected' : ''}`} 
            onClick={() => handleImageClick(image)}
          >
            <img src={image.urls.small} alt={image.alt_description} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSelector;
