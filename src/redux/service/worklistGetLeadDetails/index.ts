import { createSlice } from "@reduxjs/toolkit";
import { getLeadDetails } from "@mifin/redux/service/worklistGetLeadDetails/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const worklistGetLeadDetailsSlice = createSlice({
  name: "getLeadDetails",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getLeadDetails.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getLeadDetails.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getLeadDetails.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default worklistGetLeadDetailsSlice.reducer;
