// slices/formSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormState } from "../../entities/add-assignment/types";

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

const formSliceAddAssignment = createSlice({
  name: "form",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setSelectedImage: (state, action: PayloadAction<File | null>) => {
      state.selectedImage = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<boolean>) => {
      state.successMessage = action.payload;
    },
    setSuccessMessageText: (state, action: PayloadAction<string>) => {
      state.successMessageText = action.payload;
    },
    setSelectedImageForBlock: (
      state,
      action: PayloadAction<{ file: File | null; url: string | null }>
    ) => {
      state.selectedImageForBlock = action.payload;
    },
    setIsChangeView: (state, action: PayloadAction<boolean>) => {
      state.isChangeView = action.payload;
    },
    setIsError: (state, action: PayloadAction<boolean>) => {
      state.isError = action.payload;
    },
  },
});

export const {
  setTitle,
  setDescription,
  setType,
  setLanguage,
  setSelectedImage,
  setSuccessMessage,
  setSuccessMessageText,
  setSelectedImageForBlock,
  setIsChangeView,
  setIsError,
} = formSliceAddAssignment.actions;

export default formSliceAddAssignment.reducer;
