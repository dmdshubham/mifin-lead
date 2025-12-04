import { createSlice } from "@reduxjs/toolkit";
import { referCase } from "@mifin/redux/service/referCase/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const referCaseSlice = createSlice({
  name: "referCase",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(referCase.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(referCase.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(referCase.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default referCaseSlice.reducer;
