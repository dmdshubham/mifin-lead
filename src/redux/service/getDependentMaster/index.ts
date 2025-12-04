import { createSlice } from "@reduxjs/toolkit";
import { getDependentMaster } from "@mifin/redux/service/getDependentMaster/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const getDependentMasterSlice = createSlice({
  name: "getDependentMaster",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getDependentMaster.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getDependentMaster.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getDependentMaster.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default getDependentMasterSlice.reducer;
