import { createSlice } from "@reduxjs/toolkit";
import { productSaveandExit } from "@mifin/redux/service/productSaveAndExit/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const productSaveandExitSlice = createSlice({
  name: "productSaveandExit",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(productSaveandExit.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(productSaveandExit.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(productSaveandExit.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default productSaveandExitSlice.reducer;
