import { createSlice } from "@reduxjs/toolkit";
import { getCitiesByState } from "@mifin/redux/service/getCitiesByState/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const getCitiesByStateSlice = createSlice({
  name: "getCitiesByState",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCitiesByState.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getCitiesByState.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getCitiesByState.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default getCitiesByStateSlice.reducer;
