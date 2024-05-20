//@ts-nocheck
import { ImageSelector } from "../../service/image-selector";

function ImageQuestionBlock({ block, updateBlock }) {
  return (
    <div>
      {/* Логика для изображения */}
      <ImageSelector
        onImageSelect={(image) =>
          updateBlock(block.id, null, null, null, null, null, image)
        }
      />
    </div>
  );
}

export { ImageQuestionBlock };
