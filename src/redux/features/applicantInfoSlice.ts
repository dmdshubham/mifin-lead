import { createSlice } from "@reduxjs/toolkit";

const applicantInfoInitialState = {
  customerData:{
  }
} 

const applicantInfoSlice = createSlice({
  name: "applicantInfo",
  initialState: applicantInfoInitialState,
  reducers: {
    setApplicantInfo: (state, action) => {
      state.customerData = action.payload;
    },
  },
});

export const { setApplicantInfo } = applicantInfoSlice.actions;

export default applicantInfoSlice.reducer;
