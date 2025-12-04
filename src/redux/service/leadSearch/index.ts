import { createSlice } from "@reduxjs/toolkit";
import { leadSearch } from "@mifin/redux/service/leadSearch/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const leadSearchSlice = createSlice({
  name: "leadSearch",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(leadSearch.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(leadSearch.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(leadSearch.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default leadSearchSlice.reducer;
