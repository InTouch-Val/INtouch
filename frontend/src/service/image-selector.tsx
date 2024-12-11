//@ts-nocheck
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/image-selector.module.scss";
import Button from "../stories/buttons/Button";

function ImageSelector({
  onImageSelect,
  selectedImage,
  searchTerm,
  setSearchTerm,
  isDisabled,
}) {
  const [images, setImages] = useState(selectedImage ? [selectedImage] : []);
  const [isSearchDone, setIsSearchDone] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null); // Состояние для хранения ID выбранного изображения
  const accessKey = import.meta.env.VITE_APP_UNSPLASH_ACCESS_KEY;

  useEffect(() => {
    if (selectedImage) {
      const updatedImage = { ...selectedImage, id: 1 };
      setImages([updatedImage]);
      setIsSelected(true);
    }
  }, [selectedImage]);

  const searchImages = (query) => {
    if (!accessKey) {
      console.error(
        "Unsplash Access Key is missing. Please add it to .env file.",
      );
      return;
    }

    axios
      .get(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`,
      )
      .then((response) => {
        setImages(response.data.results);
        setIsSelected(false);
      })
      .catch((error) => console.error("Error searching images:", error));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchImages(searchTerm);
    setIsSearchDone(true);
  };

  const handleImageClick = (image) => {
    setSelectedImageId(image.id); // Обновляем ID выбранного изображения
    onImageSelect(image); // Вызываем функцию onImageSelect с выбранным изображением
  };

  return (
    <div className={styles.image_selector}>
      <label>Choose an Image for Your Assignment</label>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Enter the relevant keyword here and click "Search"`}
          className={`${styles.title_input} ${!selectedImage && isDisabled ? "error" : ""}`}
        />

        <Button
          buttonSize="large"
          fontSize="medium"
          label="Search"
          type="submit"
        />
      </form>
      <div className={styles.image_results}>
        {images.length > 0 ? (
          images.map((image) => (
            <div
              key={image.id}
              className={`${styles.image_item} ${image.id === selectedImageId || isSelected ? styles.selected : ""}`}
              onClick={() => handleImageClick(image)}
            >
              <img
                src={image.urls.small || image.urls.full}
                alt={image.alt_description || "image"}
              />
            </div>
          ))
        ) : isSearchDone ? (
          <p>No images were found</p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export { ImageSelector };
