import { createSlice } from "@reduxjs/toolkit";

const languageInitialState = {
  language: "en",
  defaultLanguage: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState: languageInitialState,
  reducers: {
    changeLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { changeLanguage } = languageSlice.actions;

export default languageSlice.reducer;
