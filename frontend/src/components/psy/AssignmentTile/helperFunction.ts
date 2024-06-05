import { AssignmentsType } from "../../../store/entities/assignments/types";
import { BlockType } from "../../../utils/constants";

const getObjectFromEditorState = (editorState: string) =>
  JSON.stringify(editorState);

export const separatedBlock = (assignmentsData: AssignmentsType): Partial<AssignmentsType> => {
  const blockInfo = assignmentsData.blocks.map((block) => {
    if (block.type === BlockType.Text) {
      return {
        type: block.type,
        question: block.question,
        description: getObjectFromEditorState(block.content),
        choice_replies: [],
      };
    }
    if (block.type === BlockType.Range) {
      return {
        type: block.type,
        question: block.question,
        start_range: block.minValue,
        end_range: block.maxValue,
        left_pole: block.leftPole || "Left Pole",
        right_pole: block.rightPole || "Right Pole",
      };
    }
    if (block.type === BlockType.Image) {
      return {
        type: block.type,
        question: block.question,
        image: block.image,
      };
    }
    if (block.type === BlockType.Open) {
      return {
        type: block.type,
        question: block.question,
      };
    }
    return {
      type: block.type,
      question: block.question,
      choice_replies: block.choice_replies,
    };
  });

  return blockInfo;
};
