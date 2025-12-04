import { createSlice } from "@reduxjs/toolkit";

const isReferedInitialState = {
  value:false,
};

const isReferedSlice = createSlice({
  name: "leadId",
  initialState:isReferedInitialState,
  reducers: {
    setIsReferedScreen: (state, action) => {
      state.value = action.payload.value;
    },
  },
});

export const { setIsReferedScreen } = isReferedSlice.actions;

export default isReferedSlice.reducer;
