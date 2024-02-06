import React from 'react';
import ImageSelector from '../service/image-selector';

const ImageQuestionBlock = ({ block, updateBlock }) => {
  return (
    <div>
      {/* Логика для изображения */}
      <ImageSelector onImageSelect={(image) => updateBlock(block.id, null, null, null, null, null, image)} />
    </div>
  );
};

export default ImageQuestionBlock;