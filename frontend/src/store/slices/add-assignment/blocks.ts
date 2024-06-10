import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BlocksState,
  AddBlockAction,
  RemoveBlockAction,
  UpdateBlockAction,
} from "../../entities/add-assignment/types";
import { getObjectFromEditorState } from "../../../utils/helperFunction/getObjectFromState";

const initialState: BlocksState = {
  blocks: [],
};

const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    setBlocks: (state, action) => {
      state.blocks = action.payload;
    },
    addBlock: (state, action: PayloadAction<AddBlockAction["payload"]>) => {
      state.blocks.push({
        id: state.blocks.length + 1,
        type: action.payload.type,
      });
    },
    removeBlock: (
      state,
      action: PayloadAction<RemoveBlockAction["payload"]>
    ) => {
      state.blocks = state.blocks.filter(
        (block) => block.id !== action.payload.blockId
      );
    },
    updateBlock: (
      state,
      action: PayloadAction<UpdateBlockAction["payload"]>
    ) => {
      const blockIndex = state.blocks.findIndex(
        (block) => block.id === action.payload.blockId
      );
      if (blockIndex >= 0) {
        const updatedBlock = { ...state.blocks[blockIndex] };

        if (action.payload.newContent !== undefined) {
          updatedBlock.content = action.payload.newContent;
          updatedBlock.description = getObjectFromEditorState(
            action.payload.newContent
          );
        }

        if (action.payload.newChoices !== undefined) {
          updatedBlock.choices = action.payload.newChoices;
          updatedBlock.choice_replies = action.payload.newChoices?.map(
            (choice) => ({
              reply: choice,
              checked: false,
            })
          );
        }

        if (action.payload.newTitle !== undefined)
          updatedBlock.title = action.payload.newTitle;
        if (action.payload.newMinValue !== undefined)
          updatedBlock.minValue = action.payload.newMinValue;
        if (action.payload.newMaxValue !== undefined)
          updatedBlock.maxValue = action.payload.newMaxValue;
        if (action.payload.newLeftPole !== undefined)
          updatedBlock.leftPole = action.payload.newLeftPole;
        if (action.payload.newRightPole !== undefined)
          updatedBlock.rightPole = action.payload.newRightPole;
        if (action.payload.newImage !== undefined)
          updatedBlock.image = action.payload.newImage;

        state.blocks[blockIndex] = updatedBlock;
      }
    },
  },
});

export const { setBlocks, addBlock, removeBlock, updateBlock } =
  blocksSlice.actions;

export default blocksSlice.reducer;
