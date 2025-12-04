import { createSlice } from "@reduxjs/toolkit";
import { leadEscalation } from "@mifin/redux/service/leadEscalation/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const leadEscalationSlice = createSlice({
  name: "leadEscalation",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(leadEscalation.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(leadEscalation.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(leadEscalation.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default leadEscalationSlice.reducer;
