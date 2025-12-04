import { createSlice } from "@reduxjs/toolkit";
import { getNextPrevLead } from "@mifin/redux/service/nextPrevLead/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const nextPrevLeadSlice = createSlice({
  name: "nextPrevLead",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getNextPrevLead.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getNextPrevLead.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getNextPrevLead.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default nextPrevLeadSlice.reducer;
