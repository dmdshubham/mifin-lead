import { createSlice } from "@reduxjs/toolkit";

const isEscalatedInitialState = {
  value:false,
};

const isEscalatedSlice = createSlice({
  name: "leadId",
  initialState:isEscalatedInitialState,
  reducers: {
    setIsEscalatedScreen: (state, action) => {
      state.value = action.payload.value;
    },
  },
});

export const { setIsEscalatedScreen } = isEscalatedSlice.actions;

export default isEscalatedSlice.reducer;
