import { createSlice } from "@reduxjs/toolkit";
import { help } from "@mifin/redux/service/help/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const helpSlice = createSlice({
  name: "help",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(help.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(help.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(help.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});
export default helpSlice.reducer;
