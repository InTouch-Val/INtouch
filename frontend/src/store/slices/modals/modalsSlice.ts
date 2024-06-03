import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModalExitUnsaved: false,
  showModalSaveIncomplete: false,
};

export const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    openModalExitUnsaved: (state) => {
      state.showModalExitUnsaved = true;
    },
    closeModalExitUnsaved: (state) => {
      state.showModalExitUnsaved = false;
    },

    openModalSaveIncomplete: (state) => {
      state.showModalSaveIncomplete = true;
    },
    closeModalSaveIncomplete: (state) => {
      state.showModalSaveIncomplete = false;
    },
  },
});

export const {
  openModalExitUnsaved,
  closeModalExitUnsaved,
  openModalSaveIncomplete,
  closeModalSaveIncomplete,
} = modalsSlice.actions;
export const selectShowModalExitUnsaved = (state) =>
  state.modals.showModalExitUnsaved;
export const selectShowModalSaveIncomplete = (state) =>
  state.modals.showModalSaveIncomplete;
