import { createSlice } from "@reduxjs/toolkit";

const leadIdInitialState = {
  leadId: "",
};

const leadIdSlice = createSlice({
  name: "leadId",
  initialState: leadIdInitialState,
  reducers: {
    updateLeadId: (state, action) => {
      state.leadId = action.payload.leadId;
    },
  },
});

export const { updateLeadId } = leadIdSlice.actions;

export default leadIdSlice.reducer;
