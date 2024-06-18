import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FormState,
  UpdateFormPayload,
} from "../../entities/add-assignment/types";

const initialState: FormState = {
  title: "",
  description: "",
  type: "lesson",
  language: "en",
  selectedImage: null,
  successMessage: false,
  successMessageText: "",
  selectedImageForBlock: {
    file: null,
    url: null,
  },
  isChangeView: false,
  isError: false,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateForm: (state, action: PayloadAction<UpdateFormPayload>) => {
      if (action.payload.title !== undefined) {
        state.title = action.payload.title;
      }
      if (action.payload.description !== undefined) {
        state.description = action.payload.description;
      }
      if (action.payload.type !== undefined) {
        state.type = action.payload.type;
      }
      if (action.payload.language !== undefined) {
        state.language = action.payload.language;
      }
      if (action.payload.selectedImage !== undefined) {
        state.selectedImage = action.payload.selectedImage;
      }
      if (action.payload.successMessage !== undefined) {
        state.successMessage = action.payload.successMessage;
      }
      if (action.payload.successMessageText !== undefined) {
        state.successMessageText = action.payload.successMessageText;
      }
      if (action.payload.selectedImageForBlock !== undefined) {
        state.selectedImageForBlock = action.payload.selectedImageForBlock;
      }
      if (action.payload.isChangeView !== undefined) {
        state.isChangeView = action.payload.isChangeView;
      }
      if (action.payload.isError !== undefined) {
        state.isError = action.payload.isError;
      }
    },
  },
});

export const { updateForm } = formSlice.actions;

export default formSlice.reducer;
