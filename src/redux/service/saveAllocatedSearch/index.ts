import { createSlice } from "@reduxjs/toolkit";
import { saveAllocatedSearched } from "@mifin/redux/service/saveAllocatedSearch/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const saveAllocatedSearchedSlice = createSlice({
  name: "saveAllocatedSearched",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(saveAllocatedSearched.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(saveAllocatedSearched.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(saveAllocatedSearched.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default saveAllocatedSearchedSlice.reducer;
