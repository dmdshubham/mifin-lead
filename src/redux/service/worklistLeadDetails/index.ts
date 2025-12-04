import { createSlice } from "@reduxjs/toolkit";
import { fetchLeadDetails } from "@mifin/redux/service/worklistLeadDetails/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const worklistLeadDetailsSlice = createSlice({
  name: "leadDetails",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchLeadDetails.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchLeadDetails.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchLeadDetails.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isError = action.error.message;
      });
  },
});

export default worklistLeadDetailsSlice.reducer;
