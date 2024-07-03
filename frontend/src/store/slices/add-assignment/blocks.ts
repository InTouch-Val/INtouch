import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Block,
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
    updateBlock: {
      reducer: (state, action: PayloadAction<Block>) => {
        const blockIndex = state.blocks.findIndex(
          (block) => block.id === action.payload.id
        );
        if (blockIndex >= 0) {
          state.blocks[blockIndex] = action.payload;
        }
      },
      prepare: (payload: UpdateBlockAction["payload"]) => {
        const blockIndex = initialState.blocks.findIndex(
          (block) => block.id === payload.blockId
        );
        let updatedBlock = { ...initialState.blocks[blockIndex] };

        if (payload.newContent !== undefined) {
          updatedBlock.content = payload.newContent;
          updatedBlock.description = getObjectFromEditorState(
            payload.newContent
          );
        }

        if (payload.newChoices !== undefined) {
          updatedBlock.choices = payload.newChoices;
          updatedBlock.choice_replies = payload.newChoices.map((choice) => ({
            reply: choice,
            checked: false,
          }));
        }

        if (payload.newTitle !== undefined)
          updatedBlock.title = payload.newTitle;
        if (payload.newMinValue !== undefined)
          updatedBlock.minValue = payload.newMinValue;
        if (payload.newMaxValue !== undefined)
          updatedBlock.maxValue = payload.newMaxValue;
        if (payload.newLeftPole !== undefined)
          updatedBlock.leftPole = payload.newLeftPole;
        if (payload.newRightPole !== undefined)
          updatedBlock.rightPole = payload.newRightPole;
        if (payload.newImage !== undefined)
          updatedBlock.image = payload.newImage;

        return { payload: updatedBlock };
      },
    },
  },
});

export const { setBlocks, addBlock, removeBlock, updateBlock } =
  blocksSlice.actions;

export default blocksSlice.reducer;
