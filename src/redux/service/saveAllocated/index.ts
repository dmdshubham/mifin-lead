import { createSlice } from "@reduxjs/toolkit";
import { saveAllocated } from "@mifin/redux/service/saveAllocated/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const saveAllocatedSlice = createSlice({
  name: "saveAllocated",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(saveAllocated.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(saveAllocated.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(saveAllocated.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default saveAllocatedSlice.reducer;
